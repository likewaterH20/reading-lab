/* READING LAB — the grade ladder for English.
   Thirteen levels, Grade 1 through College. Every passage is scored with
   Flesch-Kincaid by readability.py and must land within 0.9 of its grade.
   Topics are adult throughout: no passage here is about a dog and a ball.

   Speed targets: Hasbrouck & Tindal 2017 oral norms (spring, 50th pct) for
   G1-6; G7-12 extrapolated toward Brysbaert 2019's adult oral mean of 183.
   Silent targets scale toward Brysbaert's adult non-fiction mean of 238.
   To pass a level: hit the speed target AND get 2 of 3 comprehension. */

const LEVELS_EN = [

{ grade: 1, name: "Grade 1", oral: 60, silent: 70,
  passages: [
    { title: "The Bus",
      text: "I take the bus to work at six every morning. The bus is red and big inside. I sit in the back by the window and watch the street. The bus stops many times on the way. I get off at Main Street and walk from there. It is not far, so I am always on time.",
      questions: [
        { q: "When does the bus come?", a: ["At six", "At ten", "At noon", "At night"], correct: 0 },
        { q: "Where does the rider get off?", a: ["At the shop", "At Main", "At the park", "At home"], correct: 1 },
        { q: "How does the rider get to the job from the stop?", a: ["By car", "By bike", "On foot", "By train"], correct: 2 }
      ] },
    { title: "Rent and the Lease",
      text: "Rent is due on the first of the month. If the rent is late, the landlord can add a fee. The fee must be in the lease. If it is not in the lease, he can not add it. Keep the lease in a safe spot. Keep a copy of each check you send. If there is a problem, you will need the proof.",
      questions: [
        { q: "When is rent due?", a: ["The first of the month", "The last day", "Every week", "When the landlord asks"], correct: 0 },
        { q: "When can a late fee be added?", a: ["Any time", "Only if it is in the lease", "Only after a year", "Never"], correct: 1 },
        { q: "Why keep a copy of each check?", a: ["To pay less", "As proof if there is a problem", "For the bank", "For taxes"], correct: 1 }
      ] }
  ] },

{ grade: 2, name: "Grade 2", oral: 100, silent: 115,
  passages: [
    { title: "The Shift",
      text: "My shift starts at seven, so I clock in at the front desk and get my list. First I stock the empty shelves in the back room. Then I check the dates on every carton of milk. Old milk goes to the back and the fresh milk goes in front. At noon I take a thirty minute break to eat something and rest my feet. At three I clock out and head home on the bus.",
      questions: [
        { q: "What is the first task?", a: ["Checking milk", "Stocking shelves", "Taking a break", "Clocking out"], correct: 1 },
        { q: "Where does the old milk go?", a: ["In front", "In the trash", "In the back", "On the desk"], correct: 2 },
        { q: "What time does the shift end?", a: ["Noon", "Seven", "Three", "Six"], correct: 2 }
      ] },
    { title: "A Bank Account",
      text: "You can open a bank account with a photo ID. Some banks want a small deposit too. Ask if there is a monthly fee. Many banks will drop the fee if you get paid by direct deposit. Keep your PIN to yourself. Do not write it on the card. Check the balance each week so you know what you have.",
      questions: [
        { q: "What do you need to open an account?", a: ["A car", "A photo ID", "A job letter", "A lease"], correct: 1 },
        { q: "How can the monthly fee be dropped?", a: ["By asking nicely", "By direct deposit", "By using the ATM", "By paying cash"], correct: 1 },
        { q: "What should you never do with your PIN?", a: ["Change it", "Write it on the card", "Use it at night", "Tell the bank"], correct: 1 }
      ] }
  ] },

{ grade: 3, name: "Grade 3", oral: 112, silent: 130,
  passages: [
    { title: "Reading a Pay Stub",
      text: "A pay stub shows more than your pay for the week. The top number is your gross pay. That is what you earned before anything was taken out. Below it you will see the deductions. Taxes come out first, and then health insurance if you have it. The last number is net pay. That is the money that actually lands in your account. Always check that the hours match what you worked. Mistakes are easier to fix in the same week.",
      questions: [
        { q: "What is gross pay?", a: ["Pay after taxes", "Pay before deductions", "Overtime only", "The bonus"], correct: 1 },
        { q: "Which comes out first?", a: ["Insurance", "Savings", "Taxes", "Union dues"], correct: 2 },
        { q: "Why check the hours?", a: ["To get a raise", "Mistakes are easier to fix early", "For the boss", "To pay less tax"], correct: 1 }
      ] },
    { title: "The Night Market",
      text: "The night market opens when the sun goes down. Vendors roll their carts into a long line under strings of lights, and the air smells of grilled corn and sugar. Some people come to eat, while others come to walk and talk. A woman near the end sells coffee from a steel pot. She has been there for twenty years and knows most of the regulars by name. When the last cart packs up, the street goes quiet again.",
      questions: [
        { q: "When does the market open?", a: ["At noon", "In the morning", "When the sun goes down", "On weekends only"], correct: 2 },
        { q: "How long has the coffee seller been there?", a: ["Two years", "Twenty years", "One summer", "Since last week"], correct: 1 },
        { q: "What happens when the last cart leaves?", a: ["A band plays", "The lights turn red", "The street goes quiet", "People go to the beach"], correct: 2 }
      ] }
  ] },

{ grade: 4, name: "Grade 4", oral: 133, silent: 150,
  passages: [
    { title: "The Corner Store",
      text: "Every morning before school, Marco stopped at the corner store on Third Street. The owner, an older man named Sal, always had the radio on. He kept the newspapers stacked by the door and the coffee hot by six. Marco never bought much, just a roll and sometimes a piece of fruit. But he liked the routine. It made the day feel like it had a beginning, not just an alarm clock.",
      questions: [
        { q: "What time did Sal have the coffee ready?", a: ["By six", "By seven", "By eight", "By nine"], correct: 0 },
        { q: "What did Marco usually buy?", a: ["A newspaper", "A roll and sometimes fruit", "Coffee", "Nothing at all"], correct: 1 },
        { q: "Why did Marco like stopping there?", a: ["The food was cheap", "Sal was his uncle", "The routine gave the day a beginning", "It was on his way home"], correct: 2 }
      ] },
    { title: "Renewing a License",
      text: "Most states let you renew a driver's license online, but not every time. After a few renewals, they want to see you in person and take a new photo. Check the letter that comes in the mail. It tells you which kind of renewal you need. If you go in person, bring two forms of ID and proof of your address. A utility bill works. Arrive early in the day, because the line grows after lunch and the office closes on time whether you are done or not.",
      questions: [
        { q: "Why can't you always renew online?", a: ["The website is broken", "They need a new photo sometimes", "It costs more", "Online is only for new drivers"], correct: 1 },
        { q: "What counts as proof of address?", a: ["A utility bill", "A photo", "A credit card", "A friend's word"], correct: 0 },
        { q: "Why arrive early?", a: ["Parking is free", "The line grows after lunch", "Staff are friendlier", "Photos look better"], correct: 1 }
      ] }
  ] },

{ grade: 5, name: "Grade 5", oral: 146, silent: 170,
  passages: [
    { title: "How Bread Rises",
      text: "Bread rises because of yeast, a living organism too small to see. When yeast meets flour and warm water, it begins to eat the sugars in the dough. As it feeds, it releases carbon dioxide gas. The gas gets trapped in the stretchy web of gluten that forms when flour is kneaded. Thousands of tiny bubbles push the dough outward until it doubles in size. Heat from the oven kills the yeast and sets the structure, which is why bread stops rising once it bakes.",
      questions: [
        { q: "What makes the dough rise?", a: ["Salt", "Gas released by yeast", "Cold air", "Oil"], correct: 1 },
        { q: "What traps the gas?", a: ["The pan", "The crust", "The gluten web", "Sugar"], correct: 2 },
        { q: "Why does bread stop rising in the oven?", a: ["It runs out of flour", "The heat kills the yeast", "The gas escapes", "The pan is too small"], correct: 1 }
      ] },
    { title: "The Union Meeting",
      text: "The meeting was held in the back room of the diner after the dinner rush. About thirty workers came, most of them still in their uniforms. The organizer explained the proposal in plain terms. There would be a two-dollar raise, a fixed schedule posted a week ahead, and a written process for complaints. Someone asked what would happen if the owner refused. The organizer said that was the point of a union. One person can be ignored. Thirty people who agree are harder to ignore.",
      questions: [
        { q: "Where was the meeting held?", a: ["A church", "The diner's back room", "A park", "The owner's office"], correct: 1 },
        { q: "Which was part of the proposal?", a: ["Free meals", "A fixed schedule posted ahead", "New uniforms", "Shorter hours"], correct: 1 },
        { q: "What was the organizer's main point?", a: ["The owner is kind", "A group is harder to ignore than one person", "Raises are automatic", "Meetings should be shorter"], correct: 1 }
      ] }
  ] },

{ grade: 6, name: "Grade 6", oral: 146, silent: 180,
  passages: [
    { title: "Why Credit Scores Matter",
      text: "A credit score is a number that sums up how reliably you have repaid borrowed money. Lenders use it to decide whether to give you a loan and what interest rate to charge. A higher score usually means a lower rate, and over the life of a mortgage that can save thousands of dollars. The score is built from your payment history, how much of your available credit you use, and how long your accounts have been open. Paying every bill on time is the single best way to raise it. One missed payment can undo months of progress.",
      questions: [
        { q: "What does a credit score summarize?", a: ["Your income", "How reliably you repay borrowed money", "Your job history", "Your savings"], correct: 1 },
        { q: "What does a higher score usually earn you?", a: ["A bigger house", "A lower interest rate", "More credit cards", "A tax refund"], correct: 1 },
        { q: "What is the most effective way to raise it?", a: ["Opening new cards", "Paying every bill on time", "Closing old accounts", "Borrowing more"], correct: 1 }
      ] },
    { title: "The Apprentice",
      text: "Dana spent her first month as an electrician's apprentice doing almost no electrical work. She carried conduit, sorted fasteners, and swept the site every day. When she finally complained, the journeyman did not argue. He handed her a wiring diagram. He asked her to trace one circuit from the panel to the outlet. It took her forty minutes. Then he pointed out something. She had walked past that exact run of conduit every morning for four weeks without noticing it.",
      questions: [
        { q: "What did Dana do in her first month?", a: ["Wired panels", "Carried, sorted and swept", "Drew diagrams", "Trained others"], correct: 1 },
        { q: "How did the journeyman respond to her complaint?", a: ["He fired her", "He gave her a diagram to trace", "He apologized", "He ignored her"], correct: 1 },
        { q: "What was his point?", a: ["Sweeping is more important", "She had been seeing the work without understanding it", "Diagrams are useless", "Apprentices should not complain"], correct: 1 }
      ] }
  ] },

{ grade: 7, name: "Grade 7", oral: 150, silent: 195,
  passages: [
    { title: "Sleep and the Night Shift",
      text: "People who work overnight often assume they can sleep during the day and feel fine. The body does not agree. Humans evolved with an internal clock tuned to sunlight. That clock keeps releasing alertness hormones in the morning, no matter when you went to bed. Night workers therefore sleep fewer hours and wake more often. Researchers recommend blackout curtains and a consistent schedule, even on days off. They also suggest avoiding bright light on the commute home, since morning sun tells the brain to stay awake.",
      questions: [
        { q: "Why is daytime sleep harder?", a: ["Beds are uncomfortable", "The internal clock is tuned to sunlight", "Neighbors are loud", "Coffee lasts longer"], correct: 1 },
        { q: "What do night workers tend to experience?", a: ["Longer sleep", "Fewer hours and more waking", "More dreams", "No change"], correct: 1 },
        { q: "Why avoid bright light on the way home?", a: ["It hurts the eyes", "It signals the brain to stay awake", "It fades clothing", "It is expensive"], correct: 1 }
      ] },
    { title: "The Deposition",
      text: "A deposition is sworn testimony given outside a courtroom. It usually happens in a lawyer's conference room, with a stenographer recording every word. It is part of discovery, the stage of a lawsuit where each side learns what the other knows. Witnesses are often surprised by how ordinary it feels. That is precisely the danger. Everything said becomes part of the record and can be read aloud at trial. Experienced attorneys tell clients three things. Answer only the question asked. Pause before speaking. Never guess at facts you do not remember.",
      questions: [
        { q: "Where does a deposition usually happen?", a: ["A courtroom", "A lawyer's conference room", "A police station", "A judge's home"], correct: 1 },
        { q: "What stage of a lawsuit is it part of?", a: ["Sentencing", "Discovery", "The appeal", "Jury selection"], correct: 1 },
        { q: "What do attorneys advise?", a: ["Speak quickly", "Answer only what was asked", "Guess if unsure", "Refuse to answer"], correct: 1 }
      ] }
  ] },

{ grade: 8, name: "Grade 8", oral: 150, silent: 205,
  passages: [
    { title: "How Memory Works",
      text: "Your brain does not record memories the way a camera records video. Each time you recall something, you rebuild it from pieces, and the rebuild is slightly different every time. This is why two people can leave the same conversation with two honest but conflicting accounts. Neither one is lying. Both are reconstructing. Researchers have found that the act of remembering actually modifies the memory itself, which means the events you revisit most often are the ones most likely to have drifted from what really happened.",
      questions: [
        { q: "How does the brain store memories?", a: ["Like a camera", "By rebuilding them from pieces", "In a fixed order", "Only while sleeping"], correct: 1 },
        { q: "Why can two people disagree honestly?", a: ["One is lying", "Both are reconstructing", "They heard different words", "Memory is perfect"], correct: 1 },
        { q: "Which memories drift the most?", a: ["The oldest ones", "The ones you revisit most", "The saddest ones", "The shortest ones"], correct: 1 }
      ] },
    { title: "The Cost of a Cheap Tool",
      text: "Anyone who works with their hands eventually learns the arithmetic of cheap tools. A bargain drill that fails on the third job has not saved money. It has cost the price of the drill, plus the hours lost, and sometimes the reputation of the person holding it. Professionals therefore buy the best version of the tools they use daily and the cheapest version of the ones they use once a year. The logic is not about quality for its own sake. It is about where failure is expensive, and that calculation applies well beyond the toolbox.",
      questions: [
        { q: "What is the hidden cost of a cheap drill that fails?", a: ["Nothing", "Lost hours and reputation", "Higher taxes", "A warranty fee"], correct: 1 },
        { q: "When do professionals buy the best version?", a: ["Never", "For tools used daily", "For tools used once a year", "Only on sale"], correct: 1 },
        { q: "What is the logic really about?", a: ["Brand loyalty", "Where failure is expensive", "Looking professional", "Saving space"], correct: 1 }
      ] }
  ] },

{ grade: 9, name: "Grade 9", oral: 155, silent: 215,
  passages: [
    { title: "The Grid at Peak",
      text: "The electrical grid is not designed for the average hour. It is designed for the worst one: the late afternoon of a heat wave, when every air conditioner in the region runs at once. Utilities maintain expensive generating plants that sit idle most of the year purely to survive those few hours. The cost of that idle capacity is folded into everyone's bill. This is why some providers now pay customers to shift their usage, running dishwashers overnight or letting a thermostat drift a few degrees. Reducing demand at the peak is often cheaper than building another plant to meet it.",
      questions: [
        { q: "What is the grid designed for?", a: ["The average hour", "The worst hour of demand", "Nighttime use", "Industrial customers only"], correct: 1 },
        { q: "Why do some plants sit idle most of the year?", a: ["They are broken", "They exist for the peak hours", "Fuel is scarce", "Regulations forbid use"], correct: 1 },
        { q: "Why pay customers to shift usage?", a: ["Goodwill", "Reducing peak demand can be cheaper than a new plant", "Tax credits", "To sell more power"], correct: 1 }
      ] },
    { title: "Negotiating the Offer",
      text: "Most people accept the first salary they are offered. The moment feels fragile, as though a single request might make the offer evaporate. In practice, employers expect a counter and have usually budgeted for one. The stronger position is to respond with appreciation, ask for a day to consider, and return with a specific number supported by a reason, such as market data or a competing offer. Make the request once, calmly, and without apology. What loses offers is not asking for more. It is asking repeatedly, vaguely, or with visible resentment.",
      questions: [
        { q: "Why do most people accept the first offer?", a: ["It is always fair", "The moment feels fragile", "Counters are illegal", "HR insists"], correct: 1 },
        { q: "What should a counter include?", a: ["A threat", "A specific number and a reason", "A list of complaints", "A deadline"], correct: 1 },
        { q: "What actually loses offers?", a: ["Asking once", "Asking repeatedly or with resentment", "Taking a day to think", "Citing market data"], correct: 1 }
      ] }
  ] },

{ grade: 10, name: "Grade 10", oral: 160, silent: 225,
  passages: [
    { title: "Antibiotic Resistance",
      text: "Antibiotics do not make bacteria resistant so much as reveal the resistant ones that already exist. In any large population of microbes, a handful carry random mutations that happen to blunt a particular drug. When the drug is given, the susceptible majority dies. The resistant minority inherits the territory and reproduces without competition. Stopping a course early makes this worse. It removes the drug before the resistant survivors have been fully suppressed. The result is a public health problem that no single patient causes and no single patient can solve.",
      questions: [
        { q: "How does resistance emerge?", a: ["Drugs create new mutations", "Drugs reveal mutations that already exist", "Bacteria learn", "Patients cause it deliberately"], correct: 1 },
        { q: "What happens to the resistant minority when a drug is given?", a: ["It dies first", "It inherits the territory", "It becomes weaker", "It stops reproducing"], correct: 1 },
        { q: "Why is stopping a course early harmful?", a: ["It wastes money", "Resistant survivors are not fully suppressed", "It causes allergies", "It has no effect"], correct: 1 }
      ] },
    { title: "The Redlined Map",
      text: "In the 1930s a federal agency drew maps of American cities and colored neighborhoods by supposed lending risk. The areas judged least desirable were shaded red. Those judgments were driven largely by the race of the residents rather than the condition of the housing, and the maps guided mortgage decisions for decades. Families in red zones could not borrow to buy or improve homes. The neighborhoods deteriorated, which was then cited as proof of the original rating. Economists still find the boundaries visible today in property values, tree cover, and even summer temperatures.",
      questions: [
        { q: "What determined the red rating?", a: ["Housing condition only", "Substantially the race of residents", "Distance from downtown", "Crime statistics"], correct: 1 },
        { q: "What happened to red-zone neighborhoods?", a: ["They received extra loans", "They deteriorated for lack of credit", "They were rebuilt", "Nothing changed"], correct: 1 },
        { q: "Where are the boundaries still visible?", a: ["Nowhere", "In property values and tree cover", "Only in old archives", "In school names"], correct: 1 }
      ] }
  ] },

{ grade: 11, name: "Grade 11", oral: 165, silent: 232,
  passages: [
    { title: "The Cost of Attention",
      text: "The economics of the modern internet rest on a quiet trade: platforms provide a service at no monetary cost, and users pay in attention, which is then resold to advertisers at a margin. What makes this arrangement unusual is that the currency is finite in a way money is not. A person can borrow money, earn more of it, or save it for later. Attention cannot be borrowed, cannot be stockpiled, and expires the instant it is not spent. Every hour surrendered to a feed is an hour that no future income can repurchase, which is why critics argue that the phrase free service obscures the most expensive transaction of the day.",
      questions: [
        { q: "What do users pay with?", a: ["Subscription fees", "Data storage", "Attention", "Advertising credits"], correct: 2 },
        { q: "How is attention different from money?", a: ["It can be borrowed", "It cannot be stockpiled or repurchased", "It grows over time", "It is taxed"], correct: 1 },
        { q: "What do critics say about 'free service'?", a: ["It is accurate", "It obscures an expensive transaction", "It should be regulated", "It only applies to ads"], correct: 1 }
      ] },
    { title: "Concrete and Carbon",
      text: "Concrete is the most widely used manufactured material on earth. Its production causes roughly eight percent of global carbon emissions, more than every airline combined. The chemistry is the problem rather than the fuel. Making cement requires heating limestone until it releases carbon dioxide as an inherent byproduct. Even a kiln powered entirely by renewable electricity would emit. Engineers are pursuing alternatives, including cements that absorb carbon as they cure. But the industry's scale, and its caution about untested materials in load-bearing structures, make the transition slow.",
      questions: [
        { q: "How much of global emissions does concrete account for?", a: ["About one percent", "Roughly eight percent", "Half", "None"], correct: 1 },
        { q: "Why would a renewable-powered kiln still emit?", a: ["Faulty design", "Limestone releases carbon dioxide when heated", "Workers drive to the site", "Renewables are unreliable"], correct: 1 },
        { q: "Why is the transition slow?", a: ["No one cares", "Scale and caution about untested load-bearing materials", "Alternatives are illegal", "Cement is too cheap"], correct: 1 }
      ] }
  ] },

{ grade: 12, name: "Grade 12", oral: 170, silent: 238,
  passages: [
    { title: "The Bystander Problem",
      text: "A widely replicated finding in social psychology holds that a person in distress is less likely to receive help as the number of witnesses increases. The phenomenon is attributed to the diffusion of responsibility among onlookers, each of whom assumes that someone else will act. The effect is not a measure of callousness but of ambiguity. Individuals scan the crowd for cues about whether a situation is genuinely an emergency, and a crowd of hesitant faces reads as reassurance. The practical remedy, taught in first-aid courses, is disarmingly specific: point at one person, describe what you see, and assign that person a single task.",
      questions: [
        { q: "What happens to the chance of help as witnesses increase?", a: ["It rises", "It falls", "It stays the same", "It depends on the weather"], correct: 1 },
        { q: "What is the effect attributed to?", a: ["Cruelty", "Diffusion of responsibility and ambiguity", "Poor eyesight", "Legal fear"], correct: 1 },
        { q: "What is the taught remedy?", a: ["Shout for anyone", "Point at one person and assign a task", "Wait for police", "Film the event"], correct: 1 }
      ] },
    { title: "Provenance",
      text: "In the art market, provenance is the documented chain of ownership from the artist's studio to the present holder. It can matter as much as the object itself, because it is the only defense against two distinct catastrophes: forgery and theft. An unbroken record establishes that a painting is what it claims to be and that no prior owner was deprived of it unlawfully. That concern became acute after the Second World War, when vast quantities of looted property entered circulation through intermediaries who preferred not to ask questions. Museums now decline acquisitions with gaps in the record spanning those years, regardless of how persuasive the canvas appears.",
      questions: [
        { q: "What is provenance?", a: ["The painting's subject", "The documented chain of ownership", "The frame's material", "The artist's signature"], correct: 1 },
        { q: "Which two problems does it defend against?", a: ["Fading and cracking", "Forgery and theft", "Taxes and tariffs", "Fire and flood"], correct: 1 },
        { q: "Why do museums decline works with wartime gaps?", a: ["They are ugly", "The gap may hide looting", "They are too expensive", "Curators are lazy"], correct: 1 }
      ] }
  ] },

{ grade: 13, name: "College", oral: 183, silent: 250,
  passages: [
    { title: "The Replication Crisis",
      text: "Beginning in the early 2010s, systematic attempts to reproduce published findings in psychology, medicine, and economics revealed that a substantial fraction could not be replicated. The outcome implicated not fraud, for the most part, but the incentive structure of academic publishing. Journals preferred novel, statistically significant results, and careers depended on producing them. Analyzing data involves many judgment calls: which observations to exclude, which variables to control for. That flexibility let researchers arrive at significance without consciously intending to deceive. The proposed reforms, including preregistration of hypotheses and mandatory data sharing, attempt to remove that flexibility rather than to police individual integrity.",
      questions: [
        { q: "What did replication attempts reveal?", a: ["All findings held", "A substantial fraction could not be reproduced", "Only medicine had problems", "Fraud was universal"], correct: 1 },
        { q: "What was primarily implicated?", a: ["Individual dishonesty", "The incentive structure of publishing", "Bad equipment", "Foreign interference"], correct: 1 },
        { q: "What do the reforms target?", a: ["Punishing researchers", "Removing analytical flexibility", "Reducing journal count", "Banning statistics"], correct: 1 }
      ] },
    { title: "Sovereign Default",
      text: "When a national government cannot or will not honor its debts, the consequences differ fundamentally from a corporate bankruptcy. No court can seize a country's assets or liquidate its institutions. Creditors are left to negotiate with a counterparty that retains, in principle, the capacity to simply decline. Historically, defaulting states have faced exclusion from capital markets and punitive borrowing costs upon their return. Occasionally they faced diplomatic or military pressure from the creditors' home governments. The modern architecture of restructuring, coordinated through institutions that lend on the condition of fiscal reform, exists largely because unstructured default has repeatedly proven ruinous for debtor and lender alike.",
      questions: [
        { q: "How does sovereign default differ from corporate bankruptcy?", a: ["It is faster", "No court can seize a country's assets", "It is always voluntary", "Creditors are paid first"], correct: 1 },
        { q: "What have defaulting states historically faced?", a: ["Rewards", "Market exclusion and punitive borrowing costs", "Free loans", "Nothing"], correct: 1 },
        { q: "Why does the modern restructuring architecture exist?", a: ["Tradition", "Unstructured default proved ruinous for both sides", "Lenders prefer it", "It is required by law"], correct: 1 }
      ] }
  ] }
];

/* attach to the content bank; data.js loads first */
LANGS.en.levels = LEVELS_EN;
