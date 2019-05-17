<!--
Man-in-the-Room Attack and Command & Control Server Proof of Concept — Bigscreen

Vondracek Martin mvondracek vondracek.mar@gmail.com

Security and Forensics of Immersive Virtual Reality Social Applications
Cyber Forensics Research & Education Group                 https://www.unhcfreg.com/
Tagliatela College of Engineering                          https://www.newhaven.edu/engineering/
University of New Haven                                    https://www.newhaven.edu
300 Boston Post Rd, West Haven, CT 06516

DISCLAIMER: This software is a part of the cyber forensic research carried out by the research group UNHcFREG @ TCoE
at the University of New Haven, CT, USA. This software was developed as a proof of concept Man-in-the-Room attack.
Details concerning the research were kept private, the software vendor (Bigscreen, Inc.) was then contacted during
responsible disclosure. No harm has been done to the official infrastructure and users. Authors assume no liability
and are not responsible for any misuse or damage caused by this software. This software is intended as a proof
of concept only. The end user of this software agrees to use this software for education and research purposes only.

 -->
# Man-in-the-Room Attack and Command & Control Server Proof of Concept — Bigscreen
> [Cyber Forensics Research & Education Group](https://www.unhcfreg.com/)<br/>
> [Tagliatela College of Engineering](https://www.newhaven.edu/engineering/)<br/>
> [University of New Haven](https://www.newhaven.edu)

> DISCLAIMER: This software is a part of the cyber forensic research carried out by the research group UNHcFREG @ TCoE
> at the University of New Haven, CT, USA. This software was developed as a proof of concept Man-in-the-Room attack.
> Details concerning the research were kept private, the software vendor (Bigscreen, Inc.) was then contacted during
> responsible disclosure. No harm has been done to the official infrastructure and users. Authors assume no liability
> and are not responsible for any misuse or damage caused by this software. This software is intended as
> a proof of concept only.
>
> The end user of this software agrees to use this software for education and research purposes only.

## About Bigscreen, Inc.
- Founding Date: November 2014
- Public Beta Launch: March 2016
- Founder & CEO: Darshan Shankar
- Funding: $14 Million
- Users: 500,000+
- Operating Systems: Windows 7, 8.1, 10
- https://bigscreenvr.com/

![Screenshot: Dashboard](/doc/screenshot.png)
*Screenshot: Dashboard*

## Install
- Run `npm install` in `.\server\ ` directory.
- Compile selected payloads in `.\server\payloads\`. For example `cl evil.c`

## Run
- Run `node .\index.js ` in `.\server\ ` directory.
- Make sure `relayWebSocketServerUrl` and `webServerUrl` configuration of the Command and Control Dashboard (`index.html`)
   corresponds to locations of the servers (`index.js`).
- Open `.\dashboard\index.html` in a browser.
 
 Command and control dashboard (`.\dashboard\index.html`) currently does not support reconnecting to zombies after page
 refresh. Please restart relay server (`.\server\index.js`) if you refresh the panel. 

## Summary of discovered exploits
Type                     | Description
-------------------------|------------
**Botnet**               | Control infected Bigscreen applications from a C&C server.
**RCE**                  | Independently download and execute any payload (malware, etc.) on victim’s computer.
**RCE**                  | Run program on victim’s machine.	
**JS RCE**               | Open remote REPL (remote Javascript `eval`) on victim’s machine.	
**Privacy violation**    | Invisibly join any discovered VR room (includes private ones). Attacker is not visible in VR. Attacker's username is hidden from Bigscreen UI.
**Privacy violation**    | Remotely and stealthily receive victim’s screensharing, audio, microphone audio.	 
**Privacy violation**    | Persistently eavesdrop victim’s chat, even if they go to another room.
**Phishing**             | Ask victim to install “required VR driver”.
**Privacy violation**    | Toggle video/audio/microphone sharing.	 
**Denial-of-service**    | Remotely kill victim’s Bigscreen application.	
**Denial-of-service**    | Kick any user from any room. *Only admin should be able to do this in his room*.	
**Denial-of-service**    | Ban selected user until restart.	
**Impersonation,<br/>Integrity&nbsp;violation** | Force victim to send any given chat message.	
**Privacy violation**    | Change signaling servers of Bigscreen application.	 
Privilege escalation     | Set selected user as room admin.	
Phishing                 | Redirect Bigscreen UI to any webpage.	
Integrity violation      | Change room’s settings (VR locks). *Only admin should be able to do this in his room.* 
Privacy violation        | Gather all victim’s logs.	 
Privacy violation        | Force victim to open screenshot directory. Attacker can see its content.	 
Miscellaneous            | Change user’s avatar.
Miscellaneous            | Play various sound effects from Bigscreen UI.


## Limitations of current implementation
- Peer connection intended for multimedia transport currently does not support fallback to TURN servers. Support for
  STUN servers was sufficient for this proof of concept. With support for STUN servers, we were able to connect
  with users across Internet without complications.
- Peer connection establishment is currently supported only with participants who are already in the room.
  This command & control dashboard does not initiate the connection but accepts incoming connections. This was sufficient
  for this proof of concept
- Command and control dashboard currently does not support reconnecting to zombies after page refresh. Please restart relay
  server if you refresh the panel.



