---
href: "/til/long_running_important_jobs"
title: Long Running Important Jobs
excerpt: Using ActiveJob and SolidQueue in Rails for long running jobs, enqueuing
  a recurring task every minute to ensure job instance, with 100 years duration and
  on_conflict:discard
date: 02/10/2025
tags:
- ActiveJob
- SolidQueue
- concurrency control
- long running job
- recurring task
published: true
updated: 02/10/2025
topics: rails
---

# Long Running Important Jobs

I had a job that needs to be running 24/7 in rails, I am using `ActiveJob` and `SolidQueue` to achieve this

SolidQueue includes concurrency controls which allow us to limit how many jobs of specific scope are running at the same time

to make sure there is always 1 instance of the job I have enqueued a recurring task every minute (' * * * * * ') that will try and enqueue this job

in the job definition i have 100 years which should give me plenty of time, `on_conflict: :discard` removes the job completely, and doesn't keep it waiting
this is ideal in our case because we don't want to wait for the job to finish as it never will, unless there is an error in which case a new one will start up

```ruby
class MqttListenerJob < ApplicationJob
  limits_concurrency to: 1, duration: 100.years, key: "MqttListenerJob", on_conflict: :discard
  queue_as :long_running

  def perform
    # ...
  end
end
```

Because i know how often i am trying to reschedule this job i can also change the polling interval and number of threads because i know how many processes should be running

```yaml
environment:
  ensure_mqtt_listening:
    class: MqttListenerJob
    schedule: '* * * * *'
```