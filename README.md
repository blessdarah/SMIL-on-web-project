# SMIL-on-web-project
Project to implement SMIL communication between a web app and a SMIL player installed.
# Documentation
***

This documentation is for the project on communicating with a SMIL player.

# Things to note
***
1. Web server to run a node js application on the frontend
2. Start the server with `npm start` 

# Tasks
[  ] Setup node server
[  ] create form to setup content in SMIL message
[  ] Save submitted data to sqlite file
[  ] Construct SMIL file syntax from the content of the form submitted.
	 The following tasks should be possible
	 [  ] Create a new text file if the user is adding new text content to send
	 [  ] Show images found in the assets dir or allow user to upload image from the file system
[  ] Ensure user can view sent messages and perform the following subtasks
	[  ] View sent messages from the database
	[  ] Resend any of the messages
	[  ] Delete the messages
	[  ] Edit any of the message and send to the play

