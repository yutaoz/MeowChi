# MeowChi
Discord Bot made in Node.js to allow users to rate each other

Companion Webapp - https://meowchi.me/

Stores user ratings/data in MongoDB database

## Usage

Create a .env file or environment variable with key 'DBURI' and value 'your-mongodb-driver'

Create a .env file or environment variable with key 'TOKEN' and value 'your-discordapp-token'

To add commands:
Create a new file in the Commands folder with the format
```javascript
    module.exports = {
      name: 'command name ([boards, [rate, etc)',
      description: 'description',
      execute(msg, args) {
        // code here
      }
    }
 ```
 
Command must also be added to the core.js file in the Commands folder


