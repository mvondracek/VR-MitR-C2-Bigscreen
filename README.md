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

Our team of researchers (Martin Vondráček, Peter Casey, Ibrahim Baggili) at the University of New Haven discovered that [Bigscreen](https://www.bigscreenvr.com/), a well-known and popular virtual reality (VR) application, and [Unity](https://unity.com), the game development platform BigScreen is built on, were vulnerable to hackers. Bigscreen, which describes itself as a "virtual living room", enables users to watch movies, collaborate on projects together and more. Our findings were **[responsibly disclosed](./responsible%20disclosure%20reports/)** to Bigscreen Inc. and Unity Technologies, see [our research paper](#publication) for details.

The allure of the metaverse along with VR technologies and speed at which they are deployed may shift focus away from security and privacy fundamentals. In this work we employ classic exploitation techniques against cutting edge devices to obtain equally novel results. The unique features of the virtual reality landscape set the stage for our **primary account of a new attack, the Man-in-the-Room (MitR)**. This attack, realized from a vulnerable social networking application led to both **worming and botnet capabilities** being adapted for VR with potential **critical impacts affecting millions of users**.
Our work improves the state-of-the-art in VR security and socio-technical research in VR. It shares several **analytical and attacking tools, example exploits, evaluation dataset, and vulnerability signatures** with the scientific and professional communities to **ensure secure VR software development**. The presented results demonstrate the detection and prevention of VR vulnerabilities, and raise questions in the law and policy domains pertaining to VR security and privacy.

**Please see [our video demonstration](https://youtu.be/N_Z3mfzLZME) and [our research paper](#publication) for more details.**

| ⚠️**DISCLAIMER:** | This software is a part of the cyber forensic research carried out by the research group [UNHcFREG](https://www.unhcfreg.com/)@[TCoE](https://www.newhaven.edu/engineering/) at the [University of New Haven, CT, USA](https://www.newhaven.edu). This software was developed as a proof of concept Man-in-the-Room attack. Details concerning the research were kept private, the software vendor (Bigscreen, Inc.) was then contacted during responsible disclosure. No harm has been done to the official infrastructure and users. Authors assume no liability and are not responsible for any misuse or damage caused by this software. This software is intended as a proof of concept only.<br/><br/>The end user of this software agrees to use this software for education and research purposes only. |
| --- | :--- |

![Screenshot: Command & Control Server](/doc/screenshot.png)
*Screenshot: Command & Control Server. See [our video demonstration](https://youtu.be/N_Z3mfzLZME) for more details.*


## About Bigscreen, Inc.
- Founding Date: November 2014
- Public Beta Launch: March 2016
- Founder & CEO: Darshan Shankar
- Funding: $14 Million
- Users: 500,000+
- Operating Systems: Windows 7, 8.1, 10
- https://bigscreenvr.com/


## Install
- Run `npm install` in `.\relay\ ` directory.
- Compile selected payloads in `.\relay\payloads\`. For example `cl evil.c`

## Run
- Run `node .\index.js ` in `.\relay\ ` directory.
- Make sure `relayWebSocketServerUrl` and `webServerUrl` configuration of the Command and Control Dashboard (`index.html`)
   corresponds to locations of the servers (`index.js`).
- Open `.\dashboard\index.html` in a browser.
 
 Command and control dashboard (`.\dashboard\index.html`) currently does not support reconnecting to zombies after page
 refresh. Please restart relay server (`.\relay\index.js`) if you refresh the panel. 

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


## Publication

This software was developed during research on
[Rise of the Metaverse's Immersive Virtual Reality Malware and the Man-in-the-Room Attack & Defenses](https://www.sciencedirect.com/science/article/pii/S0167404822003157).
Please see the paper for more details and use following citation.

~~~BibTeX
@article{Vondracek-2023-102923,
    title = {Rise of the Metaverse’s Immersive Virtual Reality Malware and the Man-in-the-Room Attack & Defenses},
    journal = {Computers \& Security},
    volume = {127},
    pages = {102923},
    year = {2023},
    issn = {0167-4048},
    doi = {https://doi.org/10.1016/j.cose.2022.102923},
    url = {https://www.sciencedirect.com/science/article/pii/S0167404822003157},
    author = {Martin Vondráček and Ibrahim Baggili and Peter Casey and Mehdi Mekni}
}
~~~


## Links

- [UNHcFREG, *BigScreen and Unity Virtual Reality Attacks and the Man in The Room Attack*](https://www.unhcfreg.com/single-post/2019/02/19/bigscreen-and-unity-virtual-reality-attacks)
- [University of New Haven, *University of New Haven Researchers Discover Critical Vulnerabilities in Popular Virtual Reality Application*](https://www.newhaven.edu/news/releases/2019/discover-vulnerabilities-virtual-reality-app.php)
- Martin Vondráček, Ibrahim Baggili, Peter Casey, and Mehdi Mekni.
  *Rise of the Metaverse's Immersive Virtual Reality Malware and
  the Man-in-the-Room Attack & Defenses*. Computers \& Security.
  vol. 127. p. 102923. 2023. Online.
  https://www.sciencedirect.com/science/article/pii/S0167404822003157
