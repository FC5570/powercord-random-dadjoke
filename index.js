/* eslint-disable */
const { Plugin } = require("powercord/entities");
const { get } = require("powercord/http");

class DadJokePlugin extends Plugin {
  async startPlugin() {
    powercord.api.commands.registerCommand({
      command: "dadjoke",
      aliases: ["joke"],
      description: "Provides random dad joke.",
      executor: async () => {
        try {
          const data = await this.getData();
          if (data.status !== 200)
            throw new Error(
              `Invalid response code from API: ${data.status}, expected 200 (OK).`
            );

          return {
            send: false,
            result: data.joke,
          };
        } catch (e) {
          return {
            send: false,
            result: `Request to API failed with error: ${e.message}. Please try again later.`,
          };
        }
      },
    });
  }

  async getData() {
    const data = await get("https://icanhazdadjoke.com/", {})
      .set("Accept", "application/json")
      .set(
        "User-Agent",
        "Powercord Dad Joke Plugin https://github.com/FC5570/powercord-random-dadjoke"
      );
    return data.body;
  }

  pluginWillUnload() {
    powercord.api.commands.unregisterCommand("dadjoke");
  }
}

module.exports = DadJokePlugin;
