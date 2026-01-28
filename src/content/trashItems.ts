export interface TrashItem {
  id: string;
  filename: string;
  icon: string;
  content: string;
}

export const trashItems: TrashItem[] = [
  // Developer humor
  {
    id: 'tps-report',
    filename: 'TPS_report_cover_sheet.pdf',
    icon: '📄',
    content: `MEMORANDUM

To: All Employees
From: Management
Re: TPS Report Cover Sheets

It has come to our attention that some employees are not using the new cover sheet for TPS reports. Did you get the memo? We're putting cover sheets on all TPS reports now. If you could just go ahead and do that from now on, that would be great.

And I'm going to need you to come in on Saturday. Thaaanks.`
  },
  {
    id: 'tabs-spaces',
    filename: 'tabs_vs_spaces_final_answer.txt',
    icon: '📝',
    content: `TABS VS SPACES: THE DEFINITIVE ANSWER

After years of research and debate, the answer is...

*file corrupted*

Just kidding. It's tabs. Fight me.

No wait, spaces.

Actually, whoever wrote the codebase first wins.

This file has been deleted 47 times.`
  },
  {
    id: 'startup-idea',
    filename: 'startup_idea_v47_FINAL.doc',
    icon: '💡',
    content: `BILLION DOLLAR IDEA #47

It's like Uber, but for...

[27 pages of pivot strategies redacted]

Okay new plan: It's like Airbnb, but for...

[another 30 pages redacted]

You know what, let me just get a job.`
  },
  {
    id: 'env-backup',
    filename: '.env.backup.old.DONOTDELETE',
    icon: '🔐',
    content: `DATABASE_URL=postgres://admin:hunter2@localhost/mydb
SECRET_KEY=definitely_not_the_real_key_nice_try
API_KEY=sk-REDACTED_BECAUSE_I_LEARNED_MY_LESSON
AWS_SECRET=git-guardian-caught-this-one
STRIPE_KEY=we_dont_have_customers_yet_anyway`
  },
  {
    id: 'todo-2019',
    filename: 'todo_list_2019.txt',
    icon: '✅',
    content: `TODO LIST - 2019
[ ] Learn Docker (how hard can it be?)
[ ] Finish side project
[ ] Update LinkedIn
[ ] Learn Kubernetes
[ ] Start blog
[ ] Contribute to open source
[ ] Finish that side project
[ ] Learn GraphQL
[ ] Seriously finish the side project
[ ] Delete this list and pretend it never existed`
  },
  {
    id: 'git-commits',
    filename: 'git_commit_messages.log',
    icon: '📋',
    content: `commit a1b2c3d - "fixed stuff"
commit d4e5f6g - "WIP"
commit h7i8j9k - "WIP 2"
commit l0m1n2o - "please work"
commit p3q4r5s - "why"
commit t6u7v8w - "asdfasdf"
commit x9y0z1a - "final fix"
commit b2c3d4e - "final fix 2"
commit f5g6h7i - "okay actually final"
commit j8k9l0m - "i give up"
commit n1o2p3q - "jk fixed it"
commit r4s5t6u - "broke it again"
commit v7w8x9y - "friday 5pm commit"`
  },
  // Movie/TV References
  {
    id: 'happy-place',
    filename: 'happy_place_visualization.txt',
    icon: '⛳',
    content: `HAPPY GILMORE'S GUIDE TO FINDING YOUR HAPPY PLACE

Step 1: Close your eyes
Step 2: Go to your happy place
Step 3: Picture yourself at the coding bootcamp
Step 4: Your code compiles on the first try
Step 5: No merge conflicts
Step 6: The tests all pass
Step 7: Stack Overflow has the exact answer you need
Step 8: It's not deprecated

Now open your eyes and... you shanked it into the woods.
The price is WRONG, Bob.`
  },
  {
    id: 'penguin',
    filename: 'business_ethics_penguin.ppt',
    icon: '🐧',
    content: `BUSINESS ETHICS FINAL PRESENTATION
by Billy Madison

The Industrial Revolution changed the way we...

*spins in chair*

...the way we think about ethics and...

*long pause*

...business?

[SLIDE 2: Just a picture of a penguin]

In conclusion: Business. Ethics. Thank you.

Everyone in this room is now dumber for having listened to this.`
  },
  {
    id: 'pivot',
    filename: 'PIVOT_instructions.mov',
    icon: '🎬',
    content: `[TRANSCRIPT FROM DEPLOYMENT MEETING]

DevOps: "Okay, we need to pivot the architecture."
Backend: "PIVOT!"
Frontend: "PIVOT!"
DevOps: "PIVOT!"
Backend: "PIVOTTT!"
PM: "Shut up! SHUT UP! SHUT UPPP!"

[Server crashes]

Backend: "I don't think it's gonna pivot anymore."
DevOps: "You think?"`
  },
  {
    id: 'stapler',
    filename: 'stapler_location_tracker.xlsx',
    icon: '📎',
    content: `RED SWINGLINE STAPLER TRACKING LOG

Day 1: Stapler on desk. All is well.
Day 5: Stapler moved to supply room. Suspicious.
Day 12: Retrieved stapler. Moved desk to basement.
Day 15: They changed my building.
Day 23: I could set the building on fire.
Day 24: Still have stapler though.
Day 30: I was told there would be cake.
Day 31: There was no cake.

Current status: STAPLER SECURED
Threat level: ELEVATED`
  },
  {
    id: 'silicon-valley',
    filename: 'hotdog_not_hotdog.ai',
    icon: '🌭',
    content: `JIAN-YANG'S HOTDOG CLASSIFIER v1.0

Input: [IMAGE]

Processing...
Analyzing...
Running neural network...

Result: NOT HOTDOG

Accuracy: 100%*

*Note: This app only detects hotdogs.
Everything else is "not hotdog."

SEE FOOD? MORE LIKE C-FOOD. I MAKE JOKE.

ERLICH IS FAT AND POOR.`
  },
  {
    id: 'this-guy',
    filename: 'this_guy_fucks.txt',
    icon: '💼',
    content: `PERFORMANCE REVIEW: JARED DUNN

Technical Skills: Adequate
Communication: Excellent
Team Collaboration: Exceptional
Business Operations: Outstanding

Additional Notes:
- Has mysterious past
- May have been involved with international crime syndicate?
- Sleeps in garage (by choice?)
- THIS GUY FUCKS

Overall Rating: Exceeded Expectations

"I've been known to fuck myself." - Jared, probably misquoting something`
  },
];
