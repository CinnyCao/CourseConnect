# SCRUM Retrospective Meeting 2 - May The Forks B With You
---
#### July 5th 2017 
#### 16:10 - 17:00
***
### Participants:
##### Yongxin (Samuel) Gao, gaoyong1
##### Huimin (Cinny) Cao, caohuimi
##### Tao Gao, gaotao2
##### Guanyu (Kevin) Chen, chengu17
##### Evan Chen, cheneva2
##### Ryan Scarr, scarrrya
***

# Unfinished Task:

None

# Meeting Overview:

In this retropsective, our team, May The Forks B With You, summarized the success and the errors involved in the past sprint. All members are present and have talked about their opinions in this meeting.

At the beginning, the team has discussed the change in the velocity of this sprint. Similar with the last sprint, the user story, regarding private chatroom messaging and searching posted information, that used to be scheduled for the next sprint, has been initialized before the end of this sprint. The development of database has been enriched with additional tables and attributes based on the need of real implementation. Meanwhile, the Pivotal Tracker has recorded the new features designed for our AWS server such as uploading files to AWS server. In general, the team members perceive this sprint harder than the previous one as most of the major features are implemented in this sprint. The main part of our Product Backlog remained identical to the previous sprint with small changes that apply to the modifications in some users' stories.

The major difficulties we have faced in the implementation of this sprint come from uploading files and pictures and designing user friendly views. In order to accomodate the users' need to save files as resources in the chatroom or display their profile photos, Express-fileupload module of nodejs has been imported. This technique was discovered by Sam, our product owner. Express-fileupload module allows the content of a file to be parsed into backend functions by wrapping it in a formatted data object. Then the file will be read and have its content processed by the functions defined in the backend. 

The design of database has also been debated during the implementations in sprint 2. Some team members have complained about the lack of attributes and confusion with auto-incremented ID. However, with appropriate adjustments on database such as including new attributes, the database tables work effectively with the implementation of most backend functions. Various tables may need to be joined for accessing the necessary data but the operations are not deemed complicated for most team members.

As discussed in the previous retrospective meeting, the CRC models are not applicable to our project as it is a web application. The system architecture diagram do not contain apparent dissimilarities with the one released from the last sprint. Major changes on the architecture of the project are not predictable in the future as the features designed for the next sprint are essentially based on the current structure. 

The resources and data uploaded by the users will eventually be stored in our AWS server due to the limited space for storage in the local server. Significant amount of space is required to enable the users to upload and save their profile photo under their accounts and to share files in multiple areas. 

Some of the strongest points that contribute to our success in sprint 2 are:
- Frequent communications through professional social media with group members
- Willingness to assist the teammates when needed
- Active online research for solutions to urgent difficulties
- Motivated to take initiatives for completing required tasks
- Ensure each team member is achieving expected progress

All strengths mentioned above are dedicated to the productivity of our team work so far. They will be carried into our sprint 3, the last sprint that will finalize the project. However, some weaknesses have also occured during the completion of sprint 2. For example, complaints have been received as some team members are not sufficiently responsive in the online communications. This induces hardship to estimate the progress of the overall project. Also, the updates of codes are sometimes not timely enough in Github, the version control tool so the coordination of the team work has experience certain level of difficulties. In order to circumvent these issues in the upcoming sprint, the team members have updated the most accessible way of contact to each other and promised to share the most up-to-date codes through the version control tool. Generally speaking, the corporation of all group members is smooth and efficient during the entire sprint 2 and the whole project so far. 

Although problems have been encountered during sprint 2, this sprint is an important milestone for our team. This is because the users' stories ranked high in priority and difficulty have been finalized. As well, the better idea to store the information with large scale has been made. This means we can now be focused on employing the more advanced features and satisfying more expectations of the potential users.

# Meeting Conclusion

The second scrum meeting of May The Fork B With You is hosted with success. The team members are all on the right track and ready to finish the rest of the project. Detailed plan has been designed for the next sprint to further improve the quality of our corporation. 








