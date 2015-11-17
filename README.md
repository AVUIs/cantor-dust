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
npm install -g brunch  # Install the brunch build tool
```

If the final line throws a big ugly error message, try installing it again
as root with `sudo npm install -g brunch`. This will require your password.


## Usage

```sh
brunch watch -s
# And then navigate to http://localhost:3333/
```

### Keyboard Controls

```
1-8       Focus on the nth fractal generator
up/down   Alternatively, shift the focus with the cursor keys
```

All operations below effect the focused generator:

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

,         Decrease the playrate (by 1/sqrt(2))
.         Increase the playrate (by sqrt(2))

-         Decrease the volume
=         Increase the volume
0         Toggle mute
```

## LICENCE

```
Copyright © 2015 Louis Pilfold and Berkan Eskikaya. All Rights Reserved.
```

Licence yet to be decided upon. If you are interested in using or working on
this project, please open an issue requesting that we pick a licence. :)
