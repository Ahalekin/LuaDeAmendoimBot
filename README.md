# LuaDeAmendoimBot

> ## This is a work-in-progress bot for Twitch. 

Some of the files need custom inputs, which you can see with the two <> and the type of the input like this:
`<link>`
`<name>`
.
It contains a `dotenv` requirement with a `.env` file with your `TWITCH_CHANELNAME` `TWITCH_BOT_USERNAME` `TWITCH_BOT_OAUTH` to use the bot and a local `file.json` with a `[]` on it to work.

You can build one like this:
```
TWITCH_CHANELNAME = "<channel_name>";
TWITCH_BOT_USERNAME = "<bot_username>";
TWITCH_BOT_OAUTH = "<bot_oauth>";

```
## Commands:
  **boss**: shows who's the boss.
  
  **insta**: reply to a link like an Instagram link.
  
  **giveaway**: reply to a message with a link for a giveaway.
  
  **vote**: vote for a user to prestige them.
  
  **myvote**: see how many votes you have.
  
  **rank**: see the top 5 users in the rank.
