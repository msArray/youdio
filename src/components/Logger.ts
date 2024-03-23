export class Logger {
    static success(message: string) {
        console.log(
            "%cSuccess",
            "color:white; background-color:green; padding:2px 4px; border-radius:4px;",
            message
        );
    }

    static info(message: string) {
        console.log(
            "%cInfo",
            "color:white; background-color:blue; padding:2px 4px; border-radius:4px;",
            message
        );
    }

    static warn(message: string) {
        console.log(
            "%cWarning",
            "color:white; background-color:orange; padding:2px 4px; border-radius:4px;",
            message
        );
    }

    static error(message: string) {
        console.log(
            "%cError",
            "color:white; background-color:red; padding:2px 4px; border-radius:4px;",
            message
        );
    }
}