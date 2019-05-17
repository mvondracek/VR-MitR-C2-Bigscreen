/**
 * Man-in-the-Room Attack and Command & Control Server Proof of Concept — Bigscreen
 *
 * Vondracek Martin mvondracek vondracek.mar@gmail.com
 *
 * Security and Forensics of Immersive Virtual Reality Social Applications
 * Cyber Forensics Research & Education Group                 https://www.unhcfreg.com/
 * Tagliatela College of Engineering                          https://www.newhaven.edu/engineering/
 * University of New Haven                                    https://www.newhaven.edu
 * 300 Boston Post Rd, West Haven, CT 06516
 *
 * DISCLAIMER: This software is a part of the cyber forensic research carried out by the research group UNHcFREG @ TCoE
 * at the University of New Haven, CT, USA. This software was developed as a proof of concept Man-in-the-Room attack.
 * Details concerning the research were kept private, the software vendor (Bigscreen, Inc.) was then contacted during
 * responsible disclosure. No harm has been done to the official infrastructure and users. Authors assume no liability
 * and are not responsible for any misuse or damage caused by this software. This software is intended as a proof
 * of concept only. The end user of this software agrees to use this software for education and research purposes only.
 */

#include <stdio.h>
#include <windows.h>
#include <wincon.h>

int main() {
    CONSOLE_SCREEN_BUFFER_INFO SBInfo;
    COORD SBSize;
    CONSOLE_CURSOR_INFO ConsoleCursorInfo;
    HANDLE  ConsoleOutput = GetStdHandle(STD_OUTPUT_HANDLE);

    // fullscreen
    SetConsoleDisplayMode(GetStdHandle(STD_OUTPUT_HANDLE),CONSOLE_FULLSCREEN_MODE,0); 

    // hide cursor
    GetConsoleCursorInfo(ConsoleOutput, &ConsoleCursorInfo);
    ConsoleCursorInfo.bVisible = 0;
    SetConsoleCursorInfo(ConsoleOutput, &ConsoleCursorInfo);

    // remove scrollbar
    GetConsoleScreenBufferInfo(ConsoleOutput, &SBInfo);
    SBSize.X = SBInfo.srWindow.Right - SBInfo.srWindow.Left + 1;
    SBSize.Y = SBInfo.srWindow.Bottom - SBInfo.srWindow.Top + 1;
    SetConsoleScreenBufferSize(ConsoleOutput, SBSize);

    SetConsoleTextAttribute(ConsoleOutput, FOREGROUND_GREEN | FOREGROUND_INTENSITY ); // green text
    
    printf("\n");
    printf("\n");
    printf("                           `.-::/++oosssssssoo++/::.`                          \n");
    printf("                     `.-/+ossssssssssssssssssssssssssso+/-.`                   \n");
    printf("                 .-/ossssssso+/::-..`       `.--://oosssssss+/:`               \n");
    printf("             .:+ossssso+:-.`                         `.:/+sssssso+:.           \n");
    printf("         `:+osssso+:.`         `..---:::::::---..`         .-/ossssso/-`       \n");
    printf("      .:osssso/:.      `.-:++ossssssssssssssssssssso++:-.`     `-/+sssss+:.    \n");
    printf("   .:ossss+:.     `-:+ossssssssssssssssssssssssssssssssssso+:.`    `-/osssso:` \n");
    printf("  /sssss+.    `-/ossssssso+ssssssssoooooooosssssssso//osssssssso/-`   `:osssso:\n");
    printf("   `:+ssss+:/osssssso/:-``+sssssso+++////-/++sssssss/`  .-/+osssssso//ossso/.  \n");
    printf("      `/ssssssss+/-`     +ssssso+++::++++++++/+osssss/      `.-/ossssssso-     \n");
    printf("    `:+sssss+:-`        -ssssso++/+++/+o:/++.:+/osssss.          `-/osssss+-`  \n");
    printf("  .+sssso/-`            /sssss/-/++-/++::+/+o+/+osssss/              `:+sssso+.\n");
    printf("  ./ossss+:.            /ssssso//++:/++:/+++./o/+sssss/              .:+sssso/.\n");
    printf("     -+osssso+-.        -ssssso++-/++++/::++++/+osssss.          `-/osssso+-`  \n");
    printf("      `-ossssssso+:.`    +ssssso++++++/+//+++++osssss+      `.:/ossssssss/.    \n");
    printf("   `-/ossso//ossssssso/:..osssssso++-/+/++./oossssss+` `.-:+sssssss+:-+sssso:. \n");
    printf("  :osssso:    `-/ossssssssssssssssssso+ooosossssssso//ossssssss+/-`    .+sssss:\n");
    printf("   `:osssso/-`    `.:+ossssssssssssssssssssssssssssssssssoo/:.`     ./+ssss+:` \n");
    printf("      `-+sssso+:.       `-:/+ossssssssssssssssssssso+/:-.       .:+ossss+:`    \n");
    printf("         `-/osssso+:.`         ``...---------...`          `.:+osssso/.`       \n");
    printf("             `-/ossssso+:-`                           `.:/ossssso/-`           \n");
    printf("                 `-/+osssssoo//--.``         ```.-:/+ossssso+/-`               \n");
    printf("                      `-:+ossssssssssooooooossssssssss+/:-.                    \n");
    printf("                            `.-://++ooosssooo++//:-.`                          \n");
    printf("                                                                               \n");
    printf("     ..    ..  ..     ..  ..    ...        ....... .....    .......    .--.    \n");
    printf("    /so   -ss- sso.  .so -ss-   /s+        +so//// oso/oso- +ss///  -+so++os:  \n");
    printf("    /so   -ss- ssos/`.so -ss:...+s+ ./+o+/ +so```  os+  os/ +so... -ss/`   `   \n");
    printf("    /so   -ss- ss-/so/so -ssooooos+ os:  ` +ssooo. ossoos/` +ssooo :ss. `+++/  \n");
    printf("    :ss:``/so` ss. -osso -ss-   /s+ ss:  . +so     os+`oso. +so```  os+.`.+so  \n");
    printf("     -+osso/.  ss.  `:oo -ss-   /s+ -+ooo+ +so     os+ `/oo.+ssssss  :+osso+:  \n");
    printf("\n");
    printf("\n");

    SetConsoleTextAttribute(ConsoleOutput, FOREGROUND_RED | FOREGROUND_INTENSITY); // red text
    printf("You could have been hacked due to a security flaw in the Bigscreen Steam app.\n");

    getchar();
    return 0;
}
