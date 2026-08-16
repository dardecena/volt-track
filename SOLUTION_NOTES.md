### Written question

## Scenario:
Imagine this system needs to work inside a port where robots 
frequently experience intermittent or low-bandwidth connectivity. 
A robot may be offline for minutes at a time and cannot always 
reach the cloud immediately after a status change occurs.

**How would you adapt the status reporting to handle this reliably?** 

Consider what happens on the robot side, how data eventually reaches 
the cloud, and how the dashboard should reflect uncertainty about a 
robot's current state.

**What tradeoffs does your approach involve?**

If the robot is offline for a few minutes at a time and not immediately available. 
it is important for the robot to continuously collect the status data, and be able 
to send it once they are back online again. 

This requires a local database for data storage and persistence. A lot of data can be 
accumulated over time. It is important to focus on the critical information that is useful 
rather than minor fluctuations. To account for data storage limitations the data needs to 
have some sort of hierarchy where certain information is more critical than others. 
For example the most recent battery charge level recorded 1 minute ago at 24% is not much 
different than the charge level of 23% reported 15 minutes ago. In comparison, a reported
error that is 10-minutes old is just as important as a reported error that is 30-seconds 
old. The data should contain a unique ID and a timestamp and be stored away locally by a
message broker in the form of chunks of ordered data in a local message queue until the 
robot is back online again. 

But, what if the robot has been offline for awhile, and the stored local data stored becomes
quite large. It would not be so nice to have a giant flood of data come pouring into the 
dashboard server. One thing to consider is how much data to send and when. It wouldn't be 
ideal to send all of the data at once, so the data could possibly be chunked into parcels
Moreover, how would the broker know what data to send over? What would be a good way to 
prevent duplication? The server could send a heartbeat, a ping sent at intervals checking 
to see if the robot is back online. Once they get an OK, they could let the broker know 
the last successful status they received. This enables the broker to send the appropriate 
data and each parcel being over at a pace that is acceptable, to prevent overloading. 
This allows the server to process the parcels without it getting overworked.

Once these parcels are received, they need to be processed. What if the network went down 
during the time the data was being delivered, and the broker tries to send the same parcel
over? To prevent the same data from being processed twice, the data IDs need to be 
cross-checked to see if is data that has already been received. Moreover, to confirm, a
successful data transfer, a receipt could be sent showing which data has been accepted and 
taken for processing into the ingestion queue. 

The tradeoff for this approach is that the robot statuses on the dashboard are not 
always in real time. The importance of this depends on the use case. For example, if 
immediate attention is required if a machine sends back an error message. Another tradeoff
are the costs of local data storage, the maintenance involved to ensure everything is 
running smoothly. On the receiving end, the attention to detail to prevent duplication of
data and that the data can be ingested without fail. For both, the amount of data that 
can be stored, and what protocols are in place in the event the data storage is full. 
What data should be kept? What data should be deleted?



