import { Intent, Position, Toaster } from "@blueprintjs/core";

/** Singleton toaster instance. Create separate instances for different options. */
export const AppToaster = Toaster.create({
    className: "recipe-toaster",
    icon: "tick",
    position: Position.TOP_RIGHT,
    intent: Intent.SUCCESS
});

export const ErrorToaster = Toaster.create({
    className: "recipe-toaster",
    icon: "tick",
    position: Position.TOP_RIGHT,
    intent: Intent.DANGER
});