import { registerAppEvent } from "../../private/playbackLoader.js";

const getAccessToken = async (refreshToken, clientId, clientSecret) => {
  const url = "https://accounts.spotify.com/api/token";

  let authEncoded = btoa(`${clientId}:${clientSecret}`);

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${authEncoded}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  };

  const body = await fetch(url, payload);
  const response = await body.json();
  return response.access_token;
};

export class App {
  updateCheckInterval = 0.5 * 60 * 1000;

  constructor(config) {
    this.config = config;

    (async () => {
      while (true) {
        (async () => {
          try {
            await this.checkForNewSong();
          } catch (e) {
            console.log(e);
          }
        })();
        await new Promise((r) => setTimeout(r, this.updateCheckInterval));
      }
    })();
  }

  async checkForNewSong() {
    if (!this.accessToken) {
      this.accessToken = await getAccessToken(
        this.config.refreshToken,
        this.config.clientId,
        this.config.clientSecret
      );
    }

    let res = await fetch("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      method: "GET",
    });

    if (res.status == 204) {
      this.currentlyPlaying = false;
      return;
    }

    res = await res.json();
    if (res.error) {
      this.accessToken = undefined;
      return await this.checkForNewSong();
    }

    if (this.currentlyPlaying) return;
    this.currentlyPlaying = true;

    let songName = res.item.name;
    let artist = res.item.artists[0].name;
    let cover = res.item.album.images.sort((a, b) => b.height - a.height)[0]
      .url;
    let href = "https://spotify.com";
    if (res.item.external_urls?.spotify) {
      href = res.item.external_urls.spotify;
    }

    let coverReq = await fetch(cover);
    cover = Buffer.from(await coverReq.arrayBuffer()).toString("base64");

    registerAppEvent({
      app: "Spotify",
      type: songName,
      text: artist,
      media: [
        {
          buffer: cover,
          type: coverReq.headers.get("Content-Type"),
        },
      ],
      time: Date.now(),
      points: this.config.points,
      open: href,
    });
  }
}
