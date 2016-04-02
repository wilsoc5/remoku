# Introduction #

The documented ECP launch example in the 2.8 SDK doesn't work.  TheEndless has provided a pretty good example with the Shoutcast Channel:
http://forums.roku.com/viewtopic.php?p=240456#p240456
Custom channels are launched by issuing an empty HTTP POST in the following format:
```
http://my.roku.ip:8060/launch/2115?url=http%3a%2f%2fmy.shoutcast.url&name=My%20Shoutcast%20Channel
```

# Details #

On the Roku/BrightScript side of things you handle it like so:
http://forums.roku.com/viewtopic.php?p=224692#p224692
```
http://my.roku.ip:8060/launch/1234?Filter=Most%20Vital&Page=2
```
```
Sub RunUserInterface( ecp As Object )
    filter = "Most Recent"
    page = "0"
    If ecp <> invalid Then
        filter = ecp.Filter
        page = ecp.Page
    End If
    LaunchScreen( filter, page )
End Sub 
```
So the ecp params get passed in as an Object at the app runtime, which you can then access and act on in any way you see fit.  The only restrictions are that the params be url-encoded and there's an ill-defined max length for urls(see here: http://www.boutell.com/newfaq/misc/urllength.html).  I don't have any decent example code on hand for ecp launching, but it's something I'll be working on soon.

For batch files, curl can do post requests: http://superuser.com/questions/149329/how-do-i-make-a-post-request-with-curl