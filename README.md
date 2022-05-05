# Safari extension icon size workaround

> only working for "noir" extension, this is a POC

## What's the problem ?

Some safari extensions icons are wrongly sized. Too small, or too big.
A fix would simply be to one time patch all theses pics on disk, but won't work :

- Safari seem to do some king of "integrity checking" when starting the extension. If the icon is not the original, the icon won't show up in toolbar (but keeping the extension working as expected). That's the first issue
- Some extensions, like AdGuard use icons bundles in .car files. This is Apple proprietary format. Using a patched version of ThemeEngine let's me see and change the content in some ways. The issue is than icons altered this way cause an instant icon vanishing in Safari. So far no solutions for .car files

## How to solve that ?

The ideal solution I think (except an official fix) should be an fresh new Safari extension + Safari App extension to detect close event of Safari and undo the patching from that. But I'm lazy, so this is my "solution"

A daemon node script running in a loop, checking for Safari instance every 2s.
When the script see Safari, he wait 20 secondes by security and patch files
When the script no longer see Safari, he undo the patch

## Downsides ?

- 20 secondes because extension start can be delayed in my experience, and the timing can cause an anoying softlock of the extension icon.
- You should no disable/re-enable the extension when file are patched. May cause a softlock too, forcing you to kill safari, wait 5s, relaunch, speedrun to the settings to enable the extension

## Installation instructions

Clone the repo in specific stable place in your mac
Copy the .plist file in ~/Library/LaunchAgents
Edit the file and change any {PATH_TO_SAFARI_ICON_FIX} to the cloned repo path, and {PATH_TO_NODE_JS} to the absolute path of your node binary

```bash
launchctl load ~/Library/LaunchAgents/com.pointu-l.safari-icon-fix.plist
```

to start the script

You should see at least theses lines in stdout.log :

```
starting ...
started !
```

## Future ?

Apple will probably fix that in a way of other, but if I discover things about the .car files issue, especially to start doing things programaticly for any extension ... that would be super cool
