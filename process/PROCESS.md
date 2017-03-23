# Things to do

* Press kit
* Preloader
* Sound effects for menu (to emphasis choices being made)

* ~~Indicator for Sisyphus~~
* ~~Indicator for Tantalus~~
* ~~Indicator for Prometheus~~
* ~~Indicator for Danaids~~
* ~~Indicator for Zeno~~
* ~~Add menu screen with CPU selection~~
* ~~Make Sisyphus~~
* ~~Make Tantalus~~
* ~~Make Zeno~~
* ~~Make Danaids~~
* ~~Read Jesper Juul's [Zero-Player Games](https://www.jesperjuul.net/text/zeroplayergames/) because you ought to~~
* ~~Mock-up a screenshot with a CPU player indicator on it~~
* ~~Casually make the Prometheus version of the game~~

### Updates (2017-03-23 12:28)

Nothing very exciting has happened my friend. But it's that kind of game you know? All in the concept rather than the execution. Probably like most of my stuff actually, in that regard. Never all that hard to make. So I'm making away. All the versions of the game are done and the menu system exists now, so it's complete except for... the indicators.

I made a couple of mockups of how the indicators would look and they looked pretty good to me, so I've decided to go ahead and put them in. They're now in for everything except Sisyphus, which involves constructing a giant table of x,y locations for every frame in that animation which: sucks. But that's the only way to do it practically, I think. Anyway it's just a task (it's a little Sisyphean except that it's totally not because it's completely finite ha ha).

Anyway the point here is that the CPU indicator does help I think. In particular it starts pushing away from the idea that you're just watching an animation being played and that instead there is something "controlling" the game proper - it at least implies that. It also conveys, for people for whom the title isn't enough, the aesthetic idea that the computer is playing (whether or not it's faked).

Also on the question of "faking it" by just playing an animation... it's kind of interesting in that in some sense there's no important difference? Both versions involve the computer in a 'hopeless' loop of performing work to display the imagery of, say, Sisyphus pushing a boulder up a hill. One the work of repeatedly rendering frames of a video/GIF, the other the work of repeatedly providing input into a game that renders the same frames to the screen as a result. In a sense all infinite loops are Sisyphean? In a sense computers are constantly in an Ancient Greek Hell of repeated, meaningless work? This just literalises it? Is it almost mocking of the computer? Is it contemptuous? I don't mean to be!

But of course I'd still maintain there's something meaningful in the fact the computer is *playing the game* rather than *playing an animation*, the fact that there are other branches of code going unchosen/unexplored is kind of important? The classic "I could have done otherwise" despite the fact of determinism? Deep man.

### Hi Diary (2017-03-22 22:28)

Hey just a quick note to say I now have all five of the levels working as planned which is pretty nice. Remaining key tasks are to make the menu system (where the CPU randomly selects a level to play, scrolling up and down a bit before settling on a choice), and then the consideration of having a 'CPU' indicator above the head of the characters. It would look really nice, but I think there's a big question of how practice it'd turn out to be for a lot of them... e.g. Sisyphus and Tantalus are both animated entirely in the spritesheet, which would make it hard. Prometheus is easy (he doesn't move much). Danaids and Zeno are easy because they move a sprite around rather than just an animation. But yeah, to do Tantalus and Sisyphus (Sisyphus especially) would require hard coding values for the x,y location of the indicator for every frame of animation, which for Sisyphus is over 100 frames, which sounds really unpleasant. So I'll have to think about it. It may be necessary just because it would look so lovely. Ah well.

### Dear Diary (2017-03-20 16:06)

Just reporting in. I've now got Danaids and Zeno working fine. I've done both by essentially cutting and pasting in the ActionScript and translating from Flixel/AS to Phaser/JS, which has been remarkable easy, thank god. Bodes kind of well for potentially porting a bunch of my other work at some point I think. The underlying structures do 'just work' and nothing I ever do is really complex enough to worry about too much. So that's a plus, and makes me feel less like my games are being lost in the mists of time? Though of course just changing to ActionScript doesn't exactly guarantee longevity?

Anyway things are working. By the end of the week I'd expect the game will be completely done. And v r 3 will also be tidied away with its press kit and everything. I guess my aim will be to contact press on Thursday or Friday for a Wednesday release next week.

### How does the CPU play the game? (2017-03-16 15:36)

Okay so I've now got the basics of the Prometheus level all set up in terms of... well actually it just works (only with clicking for the moment). So then the question arises: how does the CPU play?

My assumption initially when coming up with the game is that it would have the same instructions (or rather, perhaps, I didn't actually think about the instructions in the first place), but does it make sense that the computer would 'read' instructions like 'rapidly click to struggle' etc.?

Perhaps also daunting: what would the CPU choose to do? Presumably they just struggle forever, meaning you'd never actually see a day/night cycle in the first place? They'd just spam the struggling... likewise for the other levels - the point is the computer would be relentless in playing the relentless game... infinite patience versus infinite labour...

But back to the instructions, does it make more sense, weirdly, to have instructions like 'rapidly call function struggle() to struggle and dislodge the eagle?' Kind of funny. Maybe better?

The flip side is to imagine it like it's the original game, in which case the computer needs to play like a human would, in that case needing to simulate clicks... can I do that? (Or simulate keypresses...)

...

So far some of this is being 'solved' by the fact I can't seem to programmatically trigger clicks (or key presses), which means that the CPU player won't be able to do that anyway. At which point I guess they just call the method? Weird... kind of appropriate for "how a computer would play", and in fact kind of nice because it means the player can actually click and just be ignored because the game only listens to the computer...

...

Okay, so it's 'solved' in the sense that I can't emulate/simulate/trigger events anyway. So it will be that the computer calls the function struggle(), which is funny. AND rather importantly, there's a kind of necessity here - when you ask the question "how would the computer play the game" it has to be something technically feasible. Thus this simply *is* how the computer would play, because it's the only way that work.

...

New niggling problem is the oddity of why one would display instructions - the computer doesn't read them or need them, so they're really for the human player watching the game. But that in itself is kind of nice. And I guess it's still true that you can display instructions whether or not the player needs to read them? And without that it does start to look pretty animated gif.

...

I'm surprised by how affecting (in some way) watching the computer playing the game actually is. Prometheus keeps struggling over and over again, and you know he won't stop, but in some ways it enhances the pathos of the game - the real relief in the game is when you give up and let the eagle eat you, allow yourself to be 'done to', but in this version of the game the tension of the struggle is never-ending.

...

Apparently Hercules rescues Prometheus. I think I knew that, but I was reminded just now on Twitter. I think I don't care though. Hah!

### Title thinking (2017-03-16 11:47)

Names so far:

* Let's Play: Ancient Greek Punishment
* Let's Play: Ancient Greek Punishment: Art Edition Edition
* Let's Play: Ancient Greek Punishment: Limited Edition

What to call the new one:

#### LEADER
**Let's Play: Ancient Greek Punishment: CPU Edition**

(CPU is the leading term for a computer opponent according to Twitter. I'm also drawn to it as a direct reference on the inner workings of a computer.)

#### ALSO
* Let's Play: Ancient Greek Punishment: Zero
* Let's Play: Ancient Greek Punishment: Zero Edition
* Let's Play: Ancient Greek Punishment: Part Zero
* Let's Play: Ancient Greek Punishment: Zero Player Edition

* Let's Play: Ancient Greek Punishment: COM Edition
* Let's Play: Ancient Greek Punishment: NPC Edition
* Let's Play: Ancient Greek Punishment: AI Edition

* Let's Play: Ancient Greek Punishment: Inhuman Edition
* Let's Play: Ancient Greek Punishment: Automatic Edition

* COM Plays: Ancient Greek Punishment
* CPU Plays: Ancient Greek Punishment
