Cantor Dust
===========

Fractal audio synthesis.


## Installation

```sh
npm install
npm install -g brunch
```


## Usage

```sh
brunch watch -s
# And then navigate to http://localhost:3333/
```

## Theory

We're going for a variation on a cantor set. Check this out:

For a pattern of “1, 0.5, 1” (the default for this sketch), the first three
iterations are:

```
1.0
1.0         0.5          1.0
1.0 0.5 1.0 0.5 0.25 0.5 1.0 0.5 1.0
```

And the last iteration is our wavetable. Banging.


## References

* [Exploring Audio Fractals by Terran Olson][exploring-audio-frac]
* [jdnorthrup/fractalwavetablesketch][fractal-sketch]

[exploring-audio-frac]: http://sessionville.com/articles/exploring-audio-fractals
[fractal-sketch]: https://github.com/jdnorthrup/fractalwavetablesketch
