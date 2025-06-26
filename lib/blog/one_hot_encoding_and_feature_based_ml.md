---
href: "/blog/one_hot_encoding_and_feature_based_ml"
title: One hot encoding and feature based ML
excerpt: In machine learning there are models, with multiple x values for a y value,
  one hot encoding adds features to models for better predictions.
date: 26/06/2025
tags:
- machine learning
- models
- one hot encoding
- features
- predictions
published: true
updated: 26/06/2025
topics: python
---

# One hot encoding and feature based ML

In mcahine learning there are many models that can be used, i think an important part of being able to find the information you are looking for is to have the knowledge of how things work.
In these models that we create there are multiple `x` values that we provide for a specific `y` value, our job is to get as many `x`'s together that we will be able to keep track of in future that we can get a single `y` value for.

### examples

I am trying to predict what would happen in the future, i have several `x` values such as the day of the week, whether it is weekend and the day of the year, this is easy to get future data for, but if we want a bit more complexity we can have it so that we have sales lag data, in order to make these predictions, we have to do one at a time to get the previous days sales, because we have to have all the `x` values to predict a singular `y` value

| Day of the week | Day of the year | Sales lag 1 | Y / Sales |
| --- | --- | --- | --- |
| Monday | 1 | 100 | 200 |
| Tuesday | 2 | 200 | 300 |
| Wednesday | 3 | 300 | 300 |
| Thursday | 4 | 300 | 250 |
| Friday | 5 | 250 | 300 |

Sales lag in this case is the previous day's sales, and if we are working in predictions we don't have values of the previous day's sales, so this is a difficult value to add to a model, it is possible because we can do a day at a time but then the results that we spit out also hava an increasing likelihood of error

### One hot encoding

in the table above, we have Day of the week that is a string, One hot encoding allows us to add this as a `feature` to our model, `features` are basically `x` values that are used, that have meaning to the final output, if we want weather to be a factor we would one hot encode weather, so given the following data:

| Weather | Day of the week | Day of the year | Sales lag 1 | Y / Sales |
| --- | --- | --- | --- | --- |
| Sunny | Monday | 1 | 100 | 200 |
| Sunny | Tuesday | 2 | 200 | 300 |
| Cloudy | Wednesday | 3 | 300 | 300 |
| Cloudy | Thursday | 4 | 300 | 250 |
| Rainy | Friday | 5 | 250 | 300 |

the day of the week is not a good candidate for one hot encoding as it has a numerical value that can be associated with it, however we should one hot encode weather so that if we know what the weather will be for the next upcoming days we can feed that in and get valueable data

it will result in the following table

| Weather_Sunny | Weather_Cloudy | Weather_Rainy | Day of the week | Day of the year | Sales lag 1 | Y / Sales |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 0 | 0 | 1 | 1 | 100 | 200 |
| 1 | 0 | 0 | 2 | 2 | 200 | 300 |
| 0 | 1 | 0 | 3 | 3 | 300 | 300 |
| 0 | 1 | 0 | 4 | 4 | 300 | 250 |
| 0 | 0 | 1 | 5 | 5 | 250 | 300 |

Now we have the `features` that we can use to predict the `y` value
and they have values that the computer can understand

if we want to get something out, we should have all the `x` values we put in, defined so that we can get a single `y` out, so if i want to add predictions with weather in the future, the accuracy of my model is also dependent on the accuracy of my weather forecast, obviously for up to 1 week that can be accurate enough but ideally it would have some sort of default value