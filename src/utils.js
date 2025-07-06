import { words } from "./words"

export function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length)
    return words[randomIndex]
}

export function getFarewellText(game) {
    const options = [
        `${game} just knocked you out.`,
        `Game over! ${game} wins this round.`,
        `You’ve been defeated by ${game}.`,
        `${game} says “try again, challenger!”`,
        `That was a critical miss in ${game}.`,
        `${game} just respawned your doubt.`,
        `Oops! ${game} stole your last life.`,
        `${game} just sent you back to the tutorial.`,
        `You were no match for ${game}.`,
        `You dropped your controller in ${game}.`,
        `Better luck next time, player one. ${game} stays undefeated.`,
        `${game} just used a cheat code against you.`,
        `The final boss in ${game} just laughed.`,
        `Your HP hit zero. ${game} claims victory.`,
        `You’ve been caught in a trap by ${game}.`,
        `Your guess just rage-quit from ${game}.`,
        `The game glitched… nope, just your guess. - ${game}`,
        `You missed the power-up in ${game}.`
    ];

    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}