Cantor Dust
===========

Cantor Dust is an audio visual instrument that generates, displays, and
sonifies cantor set like fractals. It allows to the user to control the
starting seed and number of iterations for a number of fractals at once, either
through the graphical interface, or through an midi controller. The project is
written in plain old Javascript, and runs entirely in a (modern) web browser.

## About

In the browser we functionally generate a Cantor Set fractal. With the final
iteration we create a wavetable and load it into a web audio
AudioBufferSourceNode, sonifying the fractal.

We have 8 buffer nodes, allowing us to play multiple fractals at once, leading
to interesting iterations between sequences. The buffers for each node can be
updated with new fractals while playing, so there are no gaps in the playback,
and the buffers stay in phase.

Our Cantor set algorithm is slightly more flexible than the traditional one, as
rather than completely removing sections, we attenuate them, which means we can
generate richer sounds. The number of segments and iterations we can have is
unlimited, but our interfaces (both GUI and hardware) only provides control for
up to 8 segments, and we've found that with this many it becomes too expensive
to generate more than 15 or so iterations.

For a pattern of “1, 0.5, 1” the first three iterations are like so:

```
1.0
1.0         0.5          1.0
1.0 0.5 1.0 0.5 0.25 0.5 1.0 0.5 1.0
```

This is all done in pure Javascript, and runs in modern web browsers. As a
result, it's super accessable and easy to share. :)


### Technologies

* ES6 Javascript
* Web Audio API
* Web MIDI
* HTML5 Canvas
* Brunch build system

And for extra fun: a Novation Launchpad and a Novation Launchcontrol XL.


## Installation

First, install [node.js](https://nodejs.org/). If you're on OSX and use brew
you can install with `brew install node`.

```sh
git clone https://github.com/AVUIs/cantor-dust.git # Clone the project
cd cantor-dust         # Enter the project directory
npm install            # Download required node modules
```


## Usage

```sh
npm start
# And then navigate to http://localhost:3333/
```

## Online version

You can try out a development version of Cantor Dust at [avuis.github.io/cantor-dust](http://avuis.github.io/cantor-dust/).

Note that this is untested on anything other than recent Chrome and Firefox browsers, so YMMV.

And make sure you first have a look at the section on keyboard controls below.


### Keyboard Controls

```
1-8       Focus on the nth fractal generator
up/down   Alternatively, shift the focus with the cursor keys
```

All operations below effect the focused generator.

Additionally, for those marked with (A) or (S): 

* (A): pressing the Alt key applies this operation to all the generators **except** the focused one.
* (S): Pressing the Shift key applies this operation to ALL generators.

```
q/a       Increase/Decrease the value of the first pattern slice
w/s       Increase/Decrease the value of the second pattern slice
e/d       Increase/Decrease the value of the third pattern slice
r/f       Increase/Decrease the value of the forth pattern slice

x         Reset all pattern slices

c         Copy the focused pattern
v         Paste the copied pattern

i         Invert the focused pattern

[         Decrease the number of iterations (min: 1)
]         Increase the number of iterations (max: 8)

,         Decrease the playrate (by 1/sqrt(2))   (A), (S)
.         Increase the playrate (by sqrt(2))     (A), (S)
m         Reset the playrate to 1/8              (A), (S)

p         Reset the phase to 0                   (A), (S)

-         Decrease the volume                    (A), (S)
=         Increase the volume                    (A), (S)
0         Toggle mute                            (A), (S)


Shift-L   Toggle scanlines off/on (if your machine struggles,
                                   or if you get choppy sound)

```

**Experimental**: It is also possible to save the overall state of the instrument by encoding it to the URL, and later recreating it by visiting the same url:

```
Shift-S   Save overall state to URL (which you can copy, share, revisit, etc)
```

For example, try this [deep sound](http://avuis.github.io/cantor-dust/#STATE:%5B%7B%22iterations%22:7,%22pattern%22:%5B0.4099999999999999,0.8600000000000003,0.6200000000000001,0.5%5D,%22amp%22:2.000000000000001,%22pitch%22:0.015624999999999993,%22phase%22:9688.99075944447%7D,%7B%22iterations%22:7,%22pattern%22:%5B0.5,0.5,0.8000000000000003,0.5%5D,%22amp%22:1.8000000000000007,%22pitch%22:0.011048543456039799,%22phase%22:13447.077559855532%7D,%7B%22iterations%22:7,%22pattern%22:%5B0.5,0.5,0.19999999999999973,0.5%5D,%22amp%22:1.9000000000000008,%22pitch%22:0.0220970869120796,%22phase%22:6193.946044006462%7D,%7B%22iterations%22:7,%22pattern%22:%5B0.5,0.5,0.8000000000000003,0.5%5D,%22amp%22:1.7000000000000006,%22pitch%22:0.015624999999999993,%22phase%22:10979.765624999998%7D%5D)  (make sure you have good speakers/headphones)

## LICENCE

```
Copyright © 2015 Louis Pilfold and Berkan Eskikaya. All Rights Reserved.
```

Licence yet to be decided upon. If you are interested in using or working on
this project, please open an issue requesting that we pick a licence. :)
