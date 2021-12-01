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
- [x] Setup node server
- [x] create form to setup content in SMIL message
- [x] Process form data
- [x] Save submitted data to sqlite file
- [x] Construct SMIL file syntax from the content of the form submitted.
	The following tasks should be possible
	- [x] Create a new text file if the user is adding new text content to send
	- [x] Show images found in the assets dir or allow user to upload image from the file system
- [x] Group multiple file data into a singe SMIL message file
- [x] Store SMIL files into the database.
- [] Add video smil content
- [] Show feedback messages for every event
- [x] Ensure user can view sent messages and perform the following subtasks
	- [x] View sent messages from the database
	- [] Resend any of the messages
	- [x] Delete the messages
	- [] Edit any of the message and send to the player
	- [x] Preview generated smil content
	- [x] Show the details of smil file components

- [] Add websocket communication for multiple servers running the same instance of the application.