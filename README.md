# Botzone local runner

Run [Botzone](https://botzone.org.cn) judger & bots at local.

You need:

-   Several [bots](https://wiki.botzone.org.cn/index.php?title=Bot).
-   A [judger](https://wiki.botzone.org.cn/index.php?title=%E8%A3%81%E5%88%A4).
-   Run `yarn`.
-   Run `yarn start -b path/to/bot1 path/to/bot2 ... -j path/to/judger`.

The bots and the judger must be executable. You can use a bash script if the code of your bot/judger is not self-executable.

The number of bots is the number of players. The same bot file can be repeated.

Several properties are not supported: `time`, `memory`, `verdict`, `time_limit`, `memory_limit`, `debug`.

The outputs contain the `display` property from the judger.
