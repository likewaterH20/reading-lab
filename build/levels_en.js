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
    { title: "Wash Your Hands",
      text: "Wash your hands with soap for twenty seconds. That is as long as singing happy birthday two times. Wash them before you eat and after you use the bathroom. Wash them when you come home from work. Germs live on your hands. Soap takes them off. This one habit keeps you from getting sick more than any pill.",
      questions: [
      { q: "How long should you wash your hands?", a: ["Twenty seconds", "Two seconds", "Five minutes", "One minute"], correct: 0 },
      { q: "What takes germs off your hands?", a: ["Soap", "Cold water", "A towel", "Sun"], correct: 0 },
      { q: "When should you wash them?", a: ["Before you eat", "After you sleep", "Before TV", "At noon"], correct: 0 },
      { q: "What lives on your hands?", a: ["Germs", "Salt", "Oil", "Dust only"], correct: 0 },
      { q: "What does this habit do?", a: ["Keeps you from getting sick", "Makes you taller", "Saves money", "Helps you sleep"], correct: 0 }
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
    { title: "How a Cold Spreads",
      text: "A cold is caused by a virus, not by cold weather. The virus travels in tiny drops when a sick person coughs or sneezes. It also lives on hands, phones and door handles for hours. You catch it when you touch your face with those hands. There is no medicine that cures a cold. Rest, water and time do the work. Most colds are gone in about a week.",
      questions: [
      { q: "What causes a cold?", a: ["A virus", "Cold weather", "Wet hair", "Bad food"], correct: 0 },
      { q: "How does the virus travel?", a: ["In tiny drops from a cough or sneeze", "Through the lights", "In food only", "Through the floor"], correct: 0 },
      { q: "What cures a cold?", a: ["Nothing; rest, water and time", "A pill", "Hot soup", "Vitamin C"], correct: 0 },
      { q: "How long does a cold usually last?", a: ["About a week", "One day", "A month", "An hour"], correct: 0 },
      { q: "How do you catch it from a door handle?", a: ["By touching your face with your hands", "By looking at it", "By standing near it", "By opening it"], correct: 0 }
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
    { title: "Why We Have Seasons",
      text: "The Earth is tilted as it travels around the Sun. For half the year, the top of the Earth leans toward the Sun. Then the days are long and the sunlight is strong, and it is summer in the north. For the other half, the top leans away, the days are short, and it is winter. Seasons are not caused by the Earth being closer to the Sun. In fact, the Earth is closest to the Sun in January. When it is summer in New York, it is winter in Buenos Aires.",
      questions: [
      { q: "Why do we have seasons?", a: ["The Earth is tilted", "The Sun gets hotter", "The Earth moves closer", "The Moon blocks the Sun"], correct: 0 },
      { q: "When is the Earth closest to the Sun?", a: ["In January", "In July", "In spring", "Never"], correct: 0 },
      { q: "What is summer like in the north?", a: ["Long days, strong sunlight", "Short days", "Cold nights", "More rain"], correct: 0 },
      { q: "What season is it in Buenos Aires when New York has summer?", a: ["Winter", "Summer", "Spring", "The same"], correct: 0 },
      { q: "What leans toward the Sun in northern summer?", a: ["The top of the Earth", "The Moon", "The oceans", "The bottom of the Earth"], correct: 0 }
      ] }
  ] },

{ grade: 4, name: "Grade 4", oral: 133, silent: 150,
  passages: [
    { title: "How Electricity Reaches Your Home",
      text: "Electricity is made at a power plant. Some plants burn gas; others use wind or the sun. The power travels through tall lines at very high voltage. High voltage loses less energy over a long distance. Near your street, a box on a pole called a transformer lowers the voltage to a safe level. Wires carry it to the meter on your house, which counts what you use. Inside, a breaker panel splits it into circuits. Each breaker shuts off if its circuit pulls too much current. That is why a breaker trips when too many things run at once.",
      questions: [
      { q: "Why do power lines use very high voltage?", a: ["It loses less energy over long distances", "It is cheaper to make", "It is safer", "It looks brighter"], correct: 0 },
      { q: "What does the transformer on the pole do?", a: ["Lowers the voltage to a safe level", "Makes electricity", "Stores it", "Counts your use"], correct: 0 },
      { q: "What does the meter do?", a: ["Counts what you use", "Makes the power", "Lowers the voltage", "Trips when overloaded"], correct: 0 },
      { q: "Why does a breaker trip?", a: ["A circuit pulls too much current", "The power plant stops", "It is raining", "The meter is full"], correct: 0 },
      { q: "Name one way electricity is made.", a: ["Wind", "Water pipes", "Paper", "Sound"], correct: 0 }
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
    { title: "How a Law Is Made in the United States",
      text: "A law begins as a bill, a written idea that a member of Congress introduces. A committee studies it, holds hearings and often changes it. If the committee approves, the full House or Senate debates and votes. The bill must pass both chambers in the same form, so the two sides often meet to settle the differences. Then it goes to the President, who signs it into law or vetoes it. Congress can override a veto, but only with two thirds of the votes in both chambers, which is rare. Most bills never get past the committee.",
      questions: [
      { q: "What is a bill?", a: ["A written idea for a law", "A tax", "A court ruling", "A speech"], correct: 0 },
      { q: "Who studies a bill first?", a: ["A committee", "The President", "The Supreme Court", "The voters"], correct: 0 },
      { q: "What must happen before a bill goes to the President?", a: ["Both chambers pass it in the same form", "A court approves it", "The states vote", "The committee rejects it"], correct: 0 },
      { q: "How can Congress override a veto?", a: ["Two thirds of both chambers", "A simple majority", "A new election", "It cannot"], correct: 0 },
      { q: "What happens to most bills?", a: ["They never get past the committee", "They become law", "The President vetoes them", "The Senate rewrites them"], correct: 0 }
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
    { title: "How the Heart Works",
      text: "The heart is a muscle about the size of your fist, and it beats around one hundred thousand times a day. It has four chambers. The right side receives blood that has delivered its oxygen to the body and pumps it to the lungs. The left side receives fresh blood from the lungs and pumps it out to everything else, which is why the left side is thicker and stronger. Arteries carry blood away from the heart and veins bring it back. Blood pressure is the force of that blood against the artery walls; when it stays high for years, the walls stiffen and the heart has to work harder.",
      questions: [
      { q: "About how many times does the heart beat a day?", a: ["One hundred thousand", "One thousand", "A million", "Ten thousand"], correct: 0 },
      { q: "Where does the right side pump blood?", a: ["To the lungs", "To the brain", "To the legs", "To the stomach"], correct: 0 },
      { q: "Why is the left side thicker?", a: ["It pumps blood to the whole body", "It is older", "It holds more blood", "It rests more"], correct: 0 },
      { q: "What do arteries do?", a: ["Carry blood away from the heart", "Bring blood back", "Make blood", "Filter blood"], correct: 0 },
      { q: "What is blood pressure?", a: ["The force of blood against artery walls", "The speed of the heart", "The amount of blood", "The weight of the heart"], correct: 0 }
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
    { title: "Your Rights When Police Stop You",
      text: "In the United States, anyone stopped by the police has rights, and they do not depend on citizenship. You may remain silent, and it is wise to say so out loud, because anything you say can be used in court. You may refuse a search of your body, your car or your home unless the officer has a warrant or sees something illegal in plain view. An officer may still pat you down for weapons. You may ask whether you are free to go; if the answer is yes, walk away calmly. If you are arrested, you have the right to a lawyer, and one must be provided if you cannot pay. Stay calm, keep your hands visible, and never run or argue at the scene. That protects you more than any argument.",
      questions: [
      { q: "Do these rights depend on citizenship?", a: ["No", "Yes", "Only for voters", "Only with a passport"], correct: 0 },
      { q: "What should you say if you want to stay silent?", a: ["Say out loud that you are remaining silent", "Nothing at all", "Your address", "A lie"], correct: 0 },
      { q: "When can an officer search your car without a warrant?", a: ["If something illegal is in plain view", "Any time", "Never", "Only at night"], correct: 0 },
      { q: "What can you ask during a stop?", a: ["Whether you are free to go", "For the officer's home address", "To drive away", "For a refund"], correct: 0 },
      { q: "What happens if you cannot pay for a lawyer?", a: ["One must be provided", "You get no lawyer", "You pay later with interest", "The case is dropped"], correct: 0 }
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
    { title: "Why the Moon Changes Shape",
      text: "The Moon makes no light of its own; it reflects sunlight, and half of it is always lit. What changes is how much of that lit half faces the Earth as the Moon circles us every twenty-nine and a half days. When the Moon sits between the Earth and the Sun, its dark side faces us and we see nothing: a new moon. As it moves along, a growing sliver appears, then a half, then the full disc when the Earth sits between the Moon and the Sun. The phases then shrink in reverse order. Tides follow the same cycle, because the Moon's gravity pulls the oceans toward it, raising the water on the side nearest the Moon and, less obviously, on the far side too.",
      questions: [
      { q: "Where does moonlight come from?", a: ["Reflected sunlight", "Fire on the Moon", "The Earth's glow", "Stars"], correct: 0 },
      { q: "How long is one cycle of phases?", a: ["About twenty-nine and a half days", "One week", "One year", "Twelve hours"], correct: 0 },
      { q: "When do we see a new moon?", a: ["When the Moon is between the Earth and the Sun", "When the Earth is between", "At midnight", "In winter"], correct: 0 },
      { q: "What causes tides?", a: ["The Moon's gravity pulling the oceans", "Wind", "Ships", "The Sun's heat"], correct: 0 },
      { q: "How much of the Moon is lit at any time?", a: ["Half", "All of it", "A quarter", "None"], correct: 0 }
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
    { title: "How the Internet Carries a Message",
      text: "When you send a message, your phone breaks it into small packets, and each packet carries the address of the destination and a number showing its place in the sequence. The packets travel separately, hopping from router to router, and they may take different paths across the network. That is why the system survives when any single line fails. At the far end they are put back in order, and any missing packet is requested again. The addresses are numbers. The names you type, such as a website's name, are translated into those numbers by a directory service before the first packet leaves. All of this takes a fraction of a second, which is why a message to the next room and a message to another continent feel the same.",
      questions: [
      { q: "What does your phone do to a message before sending it?", a: ["Breaks it into packets", "Encrypts it with a key only", "Prints it", "Stores it for a day"], correct: 0 },
      { q: "Why does the network survive when a line fails?", a: ["Packets can take different paths", "Lines never fail", "Messages wait", "Only one path exists"], correct: 0 },
      { q: "What happens to a missing packet?", a: ["It is requested again", "The message is lost", "It is replaced with zeros", "The router keeps it"], correct: 0 },
      { q: "What translates a website's name into numbers?", a: ["A directory service", "Your keyboard", "The sender", "The screen"], correct: 0 },
      { q: "What are addresses on the network?", a: ["Numbers", "Names", "Colors", "Pictures"], correct: 0 }
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
