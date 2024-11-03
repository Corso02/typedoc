import { equal } from "assert";
import { camelToTitleCase } from "../../lib/utils/general";

describe("General.ts", () => {
    describe("camelToTitleCase", () => {
        it("Converts camel case string to title case 1", () => {
            let str = "HelloWorld";
            let res = camelToTitleCase(str);
            equal(res, "Hello World");
        })

        it("Converts camel case string to title case 2", () => {
            let str = "HelloWorldHowAreYou123";
            let res = camelToTitleCase(str);
            equal(res, "Hello World How Are You 123");
        })

        it("Converts string to title case (already in title case)", () => {
            let res = camelToTitleCase("Testing Typedoc");
            equal(res, "Testing Typedoc");
        })
        
        it("Supports empty string", () => {
            let res = camelToTitleCase("");
            equal(res, "");
        })
    })
})