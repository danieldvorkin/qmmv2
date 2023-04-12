import { Intent, Position, Toaster } from "@blueprintjs/core";

/** Singleton toaster instance. Create separate instances for different options. */
export const AppToaster = Toaster.create({
    icon: "tick",
    position: Position.TOP_RIGHT,
    intent: Intent.SUCCESS
});

export const SuccessToaster = Toaster.create({
    icon: "tick",
    position: Position.TOP_RIGHT,
    intent: Intent.SUCCESS
})

export const ErrorToaster = Toaster.create({
    icon: "tick",
    position: Position.TOP_RIGHT,
    intent: Intent.DANGER
});