# Things to do

* Make Danaids
* Read Jesper Juul's [Zero-Player Games](https://www.jesperjuul.net/text/zeroplayergames/) because you ought to

* ~~Mock-up a screenshot with a CPU player indicator on it~~
* ~~Casually make the Prometheus version of the game~~

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

(CPU is the leading term for a computer opponent according to Twitter. I'm also drawn to it as a direct commentary on the inner workings of a computer.)

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
