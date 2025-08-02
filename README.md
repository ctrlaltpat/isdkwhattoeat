#### Remake of a [project](https://youtu.be/-WxkpLZMivg) from my time in Flatiron School.

```
docker build --build-arg NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key" -t isdkwhattoeat .
```

```
docker run -p 3000:3000 isdkwhattoeat
```

##### Improvements:
* Added usage limit
* Display travel times
* Set location in settings
* Deploy with Docker