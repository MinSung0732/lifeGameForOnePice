// A short ending recap uses only entries actually written in the current life's journal.
export function endingMemories(life) {
  const journal = life.journal || [];
  if (!journal.length) return [];
  const choices = journal.filter((entry) => entry.choice);
  const categories = [
    (entry) => /^(life_home|life_first_skill|life_child_crisis)$/.test(entry.id),
    (entry) => /^life_(career$|recruit_|.*_invitation_|first_station$)/.test(entry.id),
    (entry) => /^life_(path_.*_choice$|orders$|loguetown_false_order$)/.test(entry.id),
    (entry) => /^life_(path_.*_after$|encounter_return_|loguetown_last_signal$|people_.*reunion$|meet_)/.test(entry.id)
      || life.creationVersion >= 31 && /^life_(people_ward_(return|legacy)$|path_civilian_legacy$)/.test(entry.id)
  ];
  const selected = [];
  const pick = (entry) => {
    if (entry && !selected.includes(entry)) selected.push(entry);
  };
  for (const [index, matches] of categories.entries()) {
    const pool = choices.filter(matches);
    pick(index < 2 ? pool[0] : pool.at(-1));
  }
  // Other lives have different defining choices: fill gaps without fabricating memories.
  if (selected.length < 4) {
    const remaining = choices.filter((entry) => !selected.includes(entry));
    const missing = 4 - selected.length;
    for (let index = 0; index < missing && remaining.length; index += 1) {
      const at = Math.min(remaining.length - 1, Math.floor((index + 0.5) * remaining.length / missing));
      pick(remaining[at]);
    }
  }
  const final = journal.at(-1);
  pick(final);
  if (life.creationVersion >= 32) {
    const remembered = [];
    const add = (entry) => { if (entry && entry !== final && !remembered.includes(entry)) remembered.push(entry); };
    add(selected[0]);
    add(choices.find((entry) => entry.id === "life_personal_aim"));
    add(selected[2]);
    const lateChoice = choices.find((entry) => entry.id === "life_retire_choice");
    // Keep personal relationships visible unless the player explicitly reinterpreted their original dream.
    add(lateChoice?.choice?.includes("처음의 꿈을 다른 뜻으로") ? lateChoice : selected[3] || lateChoice);
    for (const entry of [...selected, ...choices]) {
      if (remembered.length >= 4) break;
      add(entry);
    }
    if (final) remembered.push(final);
    return remembered.slice(0, 5).sort((a, b) => journal.indexOf(a) - journal.indexOf(b));
  }
  if (life.creationVersion >= 30) {
    const chosen = selected.filter((entry) => entry !== final).slice(0, 4);
    if (final) chosen.push(final);
    return chosen.sort((a, b) => journal.indexOf(a) - journal.indexOf(b));
  }
  return selected.slice(0, final && selected.includes(final) ? 5 : 4)
    .sort((a, b) => journal.indexOf(a) - journal.indexOf(b));
}
