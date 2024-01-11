let res = await fetch("https://api.spotify.com/v1/me/player", {
    // "credentials": "include",
    "headers": {
        // "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0",
        // "Accept": "*/\*",
        // "Accept-Language": "en-US,en;q=0.5",
        "Authorization": "Bearer BQCWGZCVfBBvyO4KvmbX0xB5bbaiS5nav-F7DhwwTklKH3e9BiQMWPZ_PIoAz43vNT5DbIm22QJjocxDm60WbQeNIDDAEswFuVX3gX4WdrrVjqcIfySzTmYY9hz6eoRFTEzorm_RNMqSvAVSSqWtH5mTHw3h8VjrdVnUWf_GlHdbGzYGAWqyY6mJ2S1xafqLEMp7pN1IylNQi9d3-cDLcDXM0so",
        // "Sec-Fetch-Dest": "empty",
        // "Sec-Fetch-Mode": "cors",
        // "Sec-Fetch-Site": "cross-site"
    },
    // "referrer": "http://localhost:8888/",
    "method": "GET",
    // "mode": "cors"
});

console.log((await res.json()).item.album.images);

