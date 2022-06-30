const MemoryLogger = require("../MemoryLogger");
const CommandRunner = require("../commandRunner");
const assert = require("assert");
const Server = require("../server");
const path = require("path");
const sandbox = require("../sandbox");
const fs = require("fs-extra");

describe("Genesis time config for truffle test, option undefined [ @standalone ]", function () {
  const logger = new MemoryLogger();
  let config;

  before(async function () {
    await Server.start();
  });
  after(async function () {
    await Server.stop();
  });

  describe("test with undefined option", function () {
    before("set up sandbox", function () {
      this.timeout(10000);
      let project = path.join(
        __dirname,
        "../../sources/genesis_time/genesis_time_undefined"
      );
      return sandbox.create(project).then(conf => {
        config = conf;
        config.network = "test";
        config.logger = logger;
      });
    });

    before("ensure path", async () => {
      await fs.ensureDir(config.test_directory);
    });

    it("will run test and not whine about invalid date", async function () {
      this.timeout(90000);
      await CommandRunner.run("test", config);
      const output = logger.contents();
      assert(!output.includes("Invalid Date passed to genesis-time"));
    });
  });
});
