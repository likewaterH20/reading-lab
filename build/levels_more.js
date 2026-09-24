/* READING LAB, the bigger library. More passages per level, merged after the
   two in levels_en.js by make_content.py. Same rules: adult, true, scored by
   Flesch-Kincaid within 0.9 of the grade, five questions each (the app asks
   three at random). Add here; never edit content.js by hand. */

const LEVELS_MORE = [

{ grade: 1, passages: [
  { title: "The Lunch Box",
    text: "I pack my lunch the night before work. I put rice and beans in a box with a lid. I add a fork and a napkin on top. In the morning I grab the box and go. At noon I eat at my desk with the radio on. It costs less than the food truck outside. It tastes like home to me. I save ten dollars a day this way.",
    questions: [
      { q: "When does the writer pack lunch?", a: ["The night before", "In the morning", "At noon", "After work"], correct: 0 },
      { q: "What is in the box?", a: ["Rice and beans", "Soup", "A sandwich", "Fruit"], correct: 0 },
      { q: "Where does the writer eat?", a: ["At the desk", "In the truck", "At home", "In the park"], correct: 0 },
      { q: "How much is saved each day?", a: ["Ten dollars", "Two dollars", "Fifty dollars", "Nothing"], correct: 0 },
      { q: "Why does the writer like the lunch?", a: ["It tastes like home", "It is hot", "It is free", "It is big"], correct: 0 }
    ] },
  { title: "The Test Drive",
    text: "We went to look at a used car on Saturday. The seller let us take it out for a drive. I turned on the radio for a minute. Then I turned it off again. I wanted to hear the engine run. It was quiet on the road. The brakes felt strong at the light. My wife checked the seats in the back. We said we would think about it at home. We did not buy it that day.",
    questions: [
      { q: "Why did the writer turn off the radio?", a: ["To hear the engine", "It was loud", "It was broken", "The man said to"], correct: 0 },
      { q: "What kind of car was it?", a: ["A used car", "A new car", "A truck", "A van"], correct: 0 },
      { q: "How did the brakes feel?", a: ["Strong", "Weak", "Loud", "Soft"], correct: 0 },
      { q: "What did the wife check?", a: ["The back seats", "The tires", "The price", "The lights"], correct: 0 },
      { q: "Did they buy the car that day?", a: ["No", "Yes", "Only the tires", "The man bought it"], correct: 0 }
    ] }
] },

{ grade: 2, passages: [
  { title: "Water First",
    text: "Many people feel tired in the afternoon. Often the reason is simple. They did not drink enough water. Coffee does not count the same way. Try this for one week. Drink a glass of water when you wake up. Drink one more with each meal. Keep a bottle at your desk. Most people say they feel better by Friday. It costs nothing to find out.",
    questions: [
      { q: "What is a common reason for feeling tired?", a: ["Not enough water", "Too much sleep", "Too much food", "Loud music"], correct: 0 },
      { q: "When should you drink the first glass?", a: ["When you wake up", "At noon", "Before bed", "After work"], correct: 0 },
      { q: "How long is the test?", a: ["One week", "One day", "One month", "One year"], correct: 0 },
      { q: "Where should you keep a bottle?", a: ["At your desk", "In the car", "In the fridge", "By the bed"], correct: 0 },
      { q: "What does the trick cost?", a: ["Nothing", "Ten dollars", "One dollar a day", "A bottle"], correct: 0 }
    ] },
  { title: "The Extended Warranty",
    text: "At the end of a car sale, someone will offer you an extended warranty. It covers repairs after the first warranty ends. It can cost one or two thousand dollars. You do not have to decide at the desk. Ask for the paper and take it home. Read what it covers and what it does not. Many people buy it and never use it. Some people use it once and are glad. Only you know how long you will keep the car.",
    questions: [
      { q: "When is the extended warranty offered?", a: ["At the end of the sale", "Before the test drive", "A year later", "On the phone"], correct: 0 },
      { q: "About how much can it cost?", a: ["One or two thousand dollars", "Fifty dollars", "Ten thousand dollars", "It is free"], correct: 0 },
      { q: "What does the writer say to do?", a: ["Take the paper home and read it", "Sign right away", "Never buy it", "Ask a friend to sign"], correct: 0 },
      { q: "What does it cover?", a: ["Repairs after the first warranty ends", "Gas", "Parking", "Insurance"], correct: 0 },
      { q: "Who knows how long you will keep the car?", a: ["Only you", "The seller", "The bank", "The mechanic"], correct: 0 }
    ] }
] },

{ grade: 3, passages: [
  { title: "How a Credit Score Works",
    text: "A credit score is a number that tells lenders how you handle money. It goes from about 300 to 850. Paying bills on time is the biggest part of the score. Using only a small part of your credit limit also helps. A long history helps too, so do not close your oldest card. Late payments stay on your report for years. You can check your score for free with many banks. A higher score means a lower interest rate on a car or a home.",
    questions: [
      { q: "What is the biggest part of a credit score?", a: ["Paying bills on time", "Having many cards", "A high income", "A new car"], correct: 0 },
      { q: "What is the range of the score?", a: ["About 300 to 850", "0 to 100", "1 to 10", "500 to 1000"], correct: 0 },
      { q: "Why keep your oldest card open?", a: ["A long history helps", "It has the best rewards", "The bank asks you to", "It costs money to close"], correct: 0 },
      { q: "How long do late payments stay on the report?", a: ["Years", "One week", "One month", "They never show"], correct: 0 },
      { q: "What does a higher score get you?", a: ["A lower interest rate", "A free car", "More cards", "A longer loan"], correct: 0 }
    ] },
  { title: "The Night Before an Interview",
    text: "Lay out your clothes the night before an interview. Look up the address and how long it takes to get there. Plan to arrive fifteen minutes early. Read the job posting one more time and pick two things you have done that match it. Write down one question to ask them. Then close the laptop and sleep. Tired people talk too fast and forget their own stories. In the morning, eat something, even if you are nervous. You will think better with food in you.",
    questions: [
      { q: "How early should you arrive?", a: ["Fifteen minutes early", "One hour early", "Right on time", "Five minutes late"], correct: 0 },
      { q: "What should you pick from your past?", a: ["Two things that match the job", "Your best joke", "Your salary", "Your old boss's name"], correct: 0 },
      { q: "Why is sleep important?", a: ["Tired people talk too fast and forget", "You look taller", "The interview is long", "It is polite"], correct: 0 },
      { q: "What should you write down?", a: ["One question to ask them", "Your address", "The salary you want", "The bus route"], correct: 0 },
      { q: "Why eat in the morning?", a: ["You think better with food", "It is free", "The interview has no lunch", "It calms your stomach"], correct: 0 }
    ] }
] },

{ grade: 4, passages: [
  { title: "Why the Sky Turns Red at Sunset",
    text: "Sunlight looks white, but it is made of every color. When the sun is high, its light travels a short path through the air. The air scatters blue light in every direction. That is why the sky looks blue at noon. At sunset the light comes in low and travels through much more air. Most of the blue is scattered away before it reaches you. The reds and oranges are what remain. Dust and smoke make the colors deeper. That is why sunsets after a wildfire can look almost purple.",
    questions: [
      { q: "Why is the sky blue at noon?", a: ["Air scatters blue light", "The sun is blue", "The ocean reflects", "Blue light is stronger"], correct: 0 },
      { q: "What happens to blue light at sunset?", a: ["Most of it is scattered away", "It gets brighter", "It turns red", "It reaches you first"], correct: 0 },
      { q: "Why does sunset light pass through more air?", a: ["It comes in low", "The air is thicker at night", "The sun is farther away", "Clouds block it"], correct: 0 },
      { q: "What makes sunset colors deeper?", a: ["Dust and smoke", "Rain", "Cold air", "The moon"], correct: 0 },
      { q: "What is sunlight made of?", a: ["Every color", "Only white", "Only blue and red", "Heat"], correct: 0 }
    ] },
  { title: "Reading a Lease Before You Sign",
    text: "A lease is a contract, and everything in it counts, even the small print. Find the rent, the day it is due, and the fee for paying late. Look for who pays for water, gas, and trash, because that can add a hundred dollars a month. Check how much notice you must give before you move out; sixty days is common. Ask what happens if you need to leave early. Take photos of every room on the day you move in and send them to the landlord. Those photos are your proof when you want your deposit back.",
    questions: [
      { q: "How much notice is common before moving out?", a: ["Sixty days", "One week", "One year", "Three days"], correct: 0 },
      { q: "Why take photos on move-in day?", a: ["Proof to get the deposit back", "For social media", "To sell furniture", "The landlord requires it"], correct: 0 },
      { q: "What can add about a hundred dollars a month?", a: ["Utilities like water, gas and trash", "Parking", "The late fee", "The deposit"], correct: 0 },
      { q: "What should you ask about?", a: ["Leaving early", "The neighbors", "The paint color", "The landlord's car"], correct: 0 },
      { q: "Does the small print count?", a: ["Yes, everything counts", "No", "Only the rent", "Only if you read it"], correct: 0 }
    ] }
] },

{ grade: 5, passages: [
  { title: "How Vaccines Train the Body",
    text: "A vaccine shows the body a harmless piece of a germ, or a weakened version of it. That lets the immune system practice. White blood cells learn the shape of the invader and build antibodies that fit it. Some of those cells stay in the body for years as memory cells. If the real germ arrives later, the body recognizes it at once. It attacks before the germ can spread. That is why a vaccinated person often never feels sick at all. A sore arm or a mild fever after a shot is a sign the practice session is working. It is not a sign of illness.",
    questions: [
      { q: "What does a vaccine show the body?", a: ["A harmless piece or weakened version of a germ", "A full disease", "A medicine", "A vitamin"], correct: 0 },
      { q: "What do memory cells do?", a: ["Recognize the germ years later", "Make you tired", "Carry oxygen", "Fight fevers"], correct: 0 },
      { q: "What does a sore arm after a shot mean?", a: ["The practice is working", "You are sick", "The shot failed", "You need another"], correct: 0 },
      { q: "What do white blood cells build?", a: ["Antibodies", "Bones", "Red cells", "Sugar"], correct: 0 },
      { q: "Why does a vaccinated person often not feel sick?", a: ["The body attacks before the germ spreads", "The germ never enters", "The shot is a painkiller", "They rest more"], correct: 0 }
    ] },
  { title: "Negotiating a Car Price",
    text: "The sticker price is a starting point, not a rule. The salesperson expects you to negotiate. Before you visit, look up what other buyers paid for the same model in your area. Several websites publish it. Decide the highest total you will pay, including taxes and fees, and write it down. Talk about the total price, not the monthly payment. A low payment can hide a very long loan. Be polite, be patient, and be willing to leave. The phone call that comes the next day is often the best offer you will get.",
    questions: [
      { q: "What is the sticker price?", a: ["A starting point", "The final price", "The lowest price", "A tax"], correct: 0 },
      { q: "Why talk about the total price, not the monthly payment?", a: ["A low payment can hide a long loan", "Payments are illegal", "Salespeople prefer it", "It is faster"], correct: 0 },
      { q: "What should you do before visiting?", a: ["Look up what others paid", "Bring cash", "Wash your old car", "Call the bank"], correct: 0 },
      { q: "What should your written number include?", a: ["Taxes and fees", "Only the car", "Gas money", "Insurance"], correct: 0 },
      { q: "When does the best offer often come?", a: ["The next day by phone", "At the first visit", "At the end of the year", "Never"], correct: 0 }
    ] }
] },

{ grade: 6, passages: [
  { title: "Why We Sleep in Cycles",
    text: "Sleep is not one long, flat state. Through the night the brain moves through cycles of about ninety minutes. Each cycle has light sleep, deep sleep, and a dreaming stage called REM. Deep sleep comes mostly in the first half of the night. It repairs the body, releases growth hormone, and clears waste from the brain. REM sleep grows longer toward morning and helps sort memories and emotions. Cutting a night short removes mostly REM. That is why a five-hour night leaves people foggy and irritable even when they feel physically rested. Waking at the end of a cycle, rather than in the middle of deep sleep, is why some mornings feel easy and others feel like climbing out of a well.",
    questions: [
      { q: "About how long is one sleep cycle?", a: ["Ninety minutes", "Ten minutes", "Four hours", "Eight hours"], correct: 0 },
      { q: "When does deep sleep mostly happen?", a: ["In the first half of the night", "Toward morning", "At noon", "All night evenly"], correct: 0 },
      { q: "What does a short night mostly remove?", a: ["REM sleep", "Deep sleep", "Light sleep", "Dreams only"], correct: 0 },
      { q: "What does REM sleep help with?", a: ["Sorting memories and emotions", "Growing bones", "Digesting food", "Building muscle"], correct: 0 },
      { q: "Why do some mornings feel easy?", a: ["You wake at the end of a cycle", "You slept less", "You ate late", "The room was cold"], correct: 0 }
    ] },
  { title: "The Real Cost of a Cheap Loan",
    text: "An advertisement for a car loan often shows only the monthly payment. That single number is chosen to look small. What it hides is the length of the loan. A payment of three hundred dollars over seventy-two months costs far more than four hundred dollars over forty-eight, because you pay interest for two extra years. Long loans also mean you owe more than the car is worth for most of its life. That becomes a problem if it is wrecked or you need to sell. Before you sign, ask for the total you will pay over the whole loan. That figure, not the payment, is the price of the car.",
    questions: [
      { q: "What does a small monthly payment often hide?", a: ["A long loan", "A broken car", "High insurance", "A big deposit"], correct: 0 },
      { q: "Why does a longer loan cost more?", a: ["You pay interest for more years", "The car costs more", "The bank charges a fee", "Taxes are higher"], correct: 0 },
      { q: "What problem comes with owing more than the car is worth?", a: ["Trouble if it is wrecked or sold", "Higher gas prices", "Lower insurance", "No problem"], correct: 0 },
      { q: "What figure is the true price of the car?", a: ["The total paid over the whole loan", "The monthly payment", "The sticker price", "The down payment"], correct: 0 },
      { q: "Which loan in the text costs less overall?", a: ["Four hundred over forty-eight months", "Three hundred over seventy-two months", "They cost the same", "It depends on the car"], correct: 0 }
    ] }
] },

{ grade: 7, passages: [
  { title: "How Antibiotics Stopped Working",
    text: "Antibiotics kill bacteria, but not all of them at once. In any large population of germs, a few carry random changes that let them survive the drug. When a patient stops taking the pills early, the weak bacteria are dead. The tough ones are left with plenty of room to multiply. Over decades, and across millions of patients, this selection has produced strains that shrug off drugs which once cured them in days. Antibiotics also do nothing against viruses, so taking them for a cold only trains the bacteria you already carry. The rule doctors now repeat is simple: take the full course, and only when a test or a doctor says it is bacterial.",
    questions: [
      { q: "Why do some bacteria survive an antibiotic?", a: ["Random changes let them resist it", "They hide in the lungs", "The drug is too weak", "They are viruses"], correct: 0 },
      { q: "What happens when a patient stops early?", a: ["The tough bacteria multiply", "The infection is cured faster", "Nothing changes", "The drug becomes stronger"], correct: 0 },
      { q: "Do antibiotics work on viruses?", a: ["No", "Yes", "Only in children", "Only at high doses"], correct: 0 },
      { q: "What is the rule doctors repeat?", a: ["Take the full course, only when it is bacterial", "Take half the pills", "Take them for every cold", "Share them with family"], correct: 0 },
      { q: "Over what period did resistant strains develop?", a: ["Decades", "Days", "One year", "Centuries"], correct: 0 }
    ] },
  { title: "What a Union Contract Actually Does",
    text: "A union contract is a written agreement between workers and an employer. It sets pay, hours, and the rules for hiring and firing. Without one, most workers in the United States can be let go for almost any reason that is not illegal discrimination. With one, the employer must show a cause and follow a process. A worker who believes the process was ignored can file a grievance, and a neutral arbitrator decides it. Contracts also spell out overtime, breaks, and seniority. That way the same rules apply to everyone, rather than depending on which manager is on shift. Dues pay for the lawyers and staff who negotiate and enforce the agreement.",
    questions: [
      { q: "What must an employer show to fire a worker under a contract?", a: ["A cause, following a process", "A doctor's note", "Nothing", "A police report"], correct: 0 },
      { q: "Who decides a grievance?", a: ["A neutral arbitrator", "The manager", "The mayor", "A vote of customers"], correct: 0 },
      { q: "Why do contracts spell out breaks and overtime?", a: ["So the same rules apply to everyone", "To reduce pay", "Because the law requires it", "To help managers"], correct: 0 },
      { q: "What do union dues pay for?", a: ["Lawyers and staff who negotiate and enforce", "The employer's profit", "Uniforms", "Holiday parties"], correct: 0 },
      { q: "Without a contract, when can most U.S. workers be let go?", a: ["For almost any reason that is not illegal discrimination", "Never", "Only after a warning", "Only for theft"], correct: 0 }
    ] }
] },

{ grade: 8, passages: [
  { title: "How a Song Gets Paid",
    text: "Every recorded song carries two separate copyrights. One is for the composition, meaning the melody and lyrics. The other is for the recording itself. When a song streams, the platform pays the owner of the recording, usually a label. It separately pays the songwriters through collecting societies that track each play. A cover version by another artist earns money for the original writers. It earns nothing for the original recording, because a new recording was made. This is why a performer who does not write can have a hit and still see a modest income. Meanwhile the writer of a song from thirty years ago may still get checks every quarter. The song plays on in supermarkets and television shows.",
    questions: [
      { q: "How many copyrights does a recorded song carry?", a: ["Two", "One", "Three", "None"], correct: 0 },
      { q: "Who is paid for a cover version?", a: ["The original writers", "The original recording's owner", "Nobody", "The supermarket"], correct: 0 },
      { q: "Who usually owns the recording?", a: ["A label", "The songwriter", "The platform", "The radio station"], correct: 0 },
      { q: "Why might a performer who does not write earn a modest income from a hit?", a: ["The composition payments go to the writers", "Streaming is free", "Labels pay nothing", "Covers take the money"], correct: 0 },
      { q: "Who tracks each play for songwriters?", a: ["Collecting societies", "The label", "The performer", "The government"], correct: 0 }
    ] },
  { title: "Reading a Pay Stub",
    text: "A pay stub separates what you earned from what you keep. Gross pay is the total before anything is taken out. Federal and state income tax come off first, and their size depends on the allowances you claimed on your tax form, so a large refund each spring usually means too much was withheld all year. Social Security and Medicare are taken at fixed rates and fund benefits you collect later. Health insurance and retirement contributions may also be deducted, often before tax, which lowers the taxable amount. Net pay is what lands in your account. Checking the stub each period catches errors in hours or rates while they are still easy to fix.",
    questions: [
      { q: "What is gross pay?", a: ["The total before deductions", "What you take home", "Overtime only", "Your bonus"], correct: 0 },
      { q: "What does a large spring refund usually mean?", a: ["Too much was withheld all year", "You earned more", "You paid no tax", "The employer made a gift"], correct: 0 },
      { q: "What are Social Security and Medicare deductions for?", a: ["Benefits you collect later", "Health insurance now", "State roads", "Your employer's costs"], correct: 0 },
      { q: "Why do pre-tax deductions help?", a: ["They lower the taxable amount", "They raise net pay", "They avoid Medicare", "They are refunded"], correct: 0 },
      { q: "Why check the stub each period?", a: ["Errors are easier to fix early", "The bank requires it", "To claim overtime twice", "To lower taxes"], correct: 0 }
    ] }
] },

{ grade: 9, passages: [
  { title: "Why Cities Are Hotter Than the Country",
    text: "On a summer night, a city center can be several degrees warmer than the farmland a few miles away. This pattern is called the urban heat island. Asphalt and concrete absorb sunlight all day and release it slowly after dark, while air conditioners push heat from inside buildings into the streets. Tall buildings trap that warm air between them and block the breeze that would carry it off. Trees cool a neighborhood in two ways: their shade keeps surfaces from heating, and the water they release through their leaves absorbs energy as it evaporates. Cities that plant along streets and paint roofs pale colors measure real drops in temperature. Hospitals in those districts report fewer heat emergencies during a wave.",
    questions: [
      { q: "What is the urban heat island?", a: ["Cities being warmer than nearby countryside", "A hot island in the sea", "A heating system", "A summer festival"], correct: 0 },
      { q: "How do trees cool a neighborhood?", a: ["Shade and water released through leaves", "By blocking rain", "By absorbing wind", "They do not"], correct: 0 },
      { q: "Where do air conditioners send heat?", a: ["Into the streets", "Underground", "Into the sky", "Into the water pipes"], correct: 0 },
      { q: "What effect do pale roofs have?", a: ["Measurable drops in temperature", "More rain", "Higher rents", "No effect"], correct: 0 },
      { q: "What do tall buildings do to warm air?", a: ["Trap it and block the breeze", "Cool it", "Push it upward", "Turn it into rain"], correct: 0 }
    ] },
  { title: "The Interest You Never See",
    text: "Compound interest is interest earned on interest, and its power depends far more on time than on the rate. Consider a worker who saves two hundred dollars a month from age twenty-five to thirty-five and then stops entirely. She will usually retire with more than a colleague who starts at thirty-five and saves the same amount every month until sixty-five. The first saver contributed a third as much money, but the early deposits had three extra decades to double and redouble. The same arithmetic works against a borrower. A credit card balance carried at twenty-four percent doubles in roughly three years if nothing is paid. Whether compounding is your friend or your enemy depends only on which side of the ledger you are standing on.",
    questions: [
      { q: "What is compound interest?", a: ["Interest earned on interest", "A flat fee", "A bank charge", "Interest paid once"], correct: 0 },
      { q: "What matters more than the rate?", a: ["Time", "The bank", "The amount", "Luck"], correct: 0 },
      { q: "Why does the early saver end up with more?", a: ["Early deposits had decades to double", "They saved more money", "Rates were higher", "They paid no tax"], correct: 0 },
      { q: "How fast does a card balance at twenty-four percent roughly double?", a: ["About three years", "Ten years", "One month", "Never"], correct: 0 },
      { q: "When is compounding your enemy?", a: ["When you are the borrower", "When you are young", "When rates are low", "When you save monthly"], correct: 0 }
    ] }
] },

{ grade: 10, passages: [
  { title: "How a Jury Is Chosen",
    text: "Before a trial begins, the court summons far more citizens than it needs, because many will be excused and others removed during questioning. Lawyers for each side ask potential jurors about their work, their experiences, and whether anything about the case would make it hard to judge fairly. Each side may dismiss a limited number of people without giving a reason, and an unlimited number for a stated cause, such as knowing a witness. The Supreme Court has ruled that jurors cannot be removed simply because of their race or sex. The result is meant to be a group of ordinary people with no stake in the outcome. That is why serving is treated as a duty rather than a favor, and why employers must release workers to attend.",
    questions: [
      { q: "Why does the court summon more people than it needs?", a: ["Many will be excused or removed", "To fill the room", "For a fee", "Because the law says twelve"], correct: 0 },
      { q: "What is a dismissal for cause?", a: ["Removal for a stated reason, unlimited in number", "Removal without reason", "A fine", "A delay"], correct: 0 },
      { q: "What has the Supreme Court ruled?", a: ["Jurors cannot be removed for race or sex", "Juries must be twelve", "Lawyers cannot ask questions", "Employers may refuse leave"], correct: 0 },
      { q: "Why is jury service treated as a duty?", a: ["Juries should have no stake in the outcome", "It pays well", "Judges prefer it", "It is optional"], correct: 0 },
      { q: "What must employers do?", a: ["Release workers to attend", "Pay a fine", "Attend as well", "Choose the jurors"], correct: 0 }
    ] },
  { title: "Why Practice Feels Worse Before It Works",
    text: "Learners often abandon a method at exactly the point where it has begun to work, because the methods that produce lasting skill tend to feel harder in the moment. Rereading a page feels smooth and productive, yet a week later little of it remains. Closing the book and trying to recall the page feels slow and uncomfortable, yet that struggle is what strengthens the memory. Psychologists call these desirable difficulties: spacing sessions apart, mixing different kinds of problems together, and testing yourself before you feel ready. Each of them lowers performance during practice and raises it on the day that matters. The practical rule is to judge a study method by what you can do a week later, never by how it felt while you were doing it.",
    questions: [
      { q: "Why do learners abandon good methods?", a: ["They feel harder in the moment", "They are expensive", "They take too long to learn", "Teachers forbid them"], correct: 0 },
      { q: "What are desirable difficulties?", a: ["Harder practices that raise later performance", "Exams", "Difficult teachers", "Long textbooks"], correct: 0 },
      { q: "Which practice feels smooth but fades fast?", a: ["Rereading", "Recalling", "Spacing", "Mixing problems"], correct: 0 },
      { q: "How should a study method be judged?", a: ["By what you can do a week later", "By how it feels", "By its price", "By its popularity"], correct: 0 },
      { q: "What does mixing kinds of problems do?", a: ["Lowers practice scores, raises later ones", "Makes practice easier", "Saves time", "Confuses everyone permanently"], correct: 0 }
    ] }
] },

{ grade: 11, passages: [
  { title: "Inflation Is a Tax on Waiting",
    text: "Inflation is the general rise of prices over time, and its most important effect is the quiet erosion of money that sits still. At an annual rate of three percent, a dollar loses roughly a quarter of its purchasing power in ten years. That means cash kept in a drawer or a non-interest account is shrinking even as its face value stays the same. Central banks raise interest rates to slow inflation, because expensive borrowing reduces spending and cools demand, but the same rates reward savers who move money into accounts that pay them. Wages usually lag prices by a year or more, so households feel poorer during a surge even when the numbers on their paychecks have risen, and a raise that merely matches inflation is not a raise at all.",
    questions: [
      { q: "What is inflation's most important effect, according to the text?", a: ["Erosion of money that sits still", "Higher wages", "Cheaper loans", "More jobs"], correct: 0 },
      { q: "At three percent a year, what happens to a dollar in ten years?", a: ["It loses about a quarter of its purchasing power", "It doubles", "It is unchanged", "It loses half"], correct: 0 },
      { q: "Why do central banks raise rates?", a: ["Expensive borrowing cools demand", "To reward banks", "To raise wages", "To print money"], correct: 0 },
      { q: "Why do households feel poorer during a surge?", a: ["Wages lag prices", "Taxes rise", "Banks close", "Prices fall"], correct: 0 },
      { q: "What is a raise that merely matches inflation?", a: ["Not a raise at all", "A large raise", "A tax", "A bonus"], correct: 0 }
    ] },
  { title: "Why Bilinguals Switch Languages Mid-Sentence",
    text: "Switching languages within a single conversation is called code-switching. For years it was dismissed as evidence of confusion or laziness, but decades of research have reversed that judgment. Fluent bilinguals switch at grammatically consistent points, almost never violating the rules of either language. That requires holding both systems active and monitoring them at once. Speakers switch for reasons that are social and precise: a word that carries the right emotional weight, a joke that only works in one language, or a signal of belonging to the person they are addressing. Brain-imaging studies show that this constant management of two systems exercises the same networks that govern attention and self-control. That may explain why bilinguals often perform well on tasks that demand ignoring distraction.",
    questions: [
      { q: "What do linguists call switching languages in one conversation?", a: ["Code-switching", "Translation", "Confusion", "Dialect"], correct: 0 },
      { q: "Where do fluent bilinguals switch?", a: ["At grammatically consistent points", "Randomly", "Only between sentences", "Only when tired"], correct: 0 },
      { q: "Which is a reason people switch, according to the text?", a: ["A word with the right emotional weight", "Forgetting the language", "Being lazy", "Being told to"], correct: 0 },
      { q: "What do brain studies suggest managing two languages exercises?", a: ["Networks for attention and self-control", "Muscle memory", "Vision", "Hearing"], correct: 0 },
      { q: "How was code-switching viewed in the past?", a: ["As confusion or laziness", "As a skill", "As art", "As rare"], correct: 0 }
    ] }
] },

{ grade: 12, passages: [
  { title: "The Placebo Effect Is Real Medicine",
    text: "A placebo is a treatment with no active ingredient. Yet patients who receive one in clinical trials frequently report genuine improvement, particularly for pain, nausea, and depression. The effect is not imaginary: brain imaging shows that expectation releases the body's own opioids and dopamine, producing measurable changes in the same circuits that active drugs target. The color, price, and ritual of a treatment all shape its strength; an injection outperforms a pill, and a pill described as expensive outperforms an identical one described as cheap. This is precisely why new drugs must beat a placebo rather than nothing. A portion of any medicine's benefit is the belief that accompanies it, and an honest trial has to subtract that portion before crediting the chemistry.",
    questions: [
      { q: "What is a placebo?", a: ["A treatment with no active ingredient", "A strong painkiller", "A vitamin", "A surgery"], correct: 0 },
      { q: "What does brain imaging show about expectation?", a: ["It releases the body's own opioids and dopamine", "Nothing happens", "It blocks all drugs", "It causes pain"], correct: 0 },
      { q: "Which is stronger, according to the text?", a: ["An injection over a pill", "A pill over an injection", "A cheap pill over an expensive one", "They are equal"], correct: 0 },
      { q: "Why must new drugs beat a placebo rather than nothing?", a: ["To subtract the benefit of belief", "Because placebos are cheaper", "To save time", "Because the law forbids untreated groups"], correct: 0 },
      { q: "For which conditions is the effect especially strong?", a: ["Pain, nausea and depression", "Broken bones", "Infections", "Blindness"], correct: 0 }
    ] },
  { title: "What a Warranty Promises and What It Does Not",
    text: "A manufacturer's warranty is a legal promise that a product will perform as described for a stated period, and it obliges the maker to repair or replace it when it does not. The fine print, however, determines whether that promise has value. Most warranties exclude damage from misuse, accidents, and unauthorized repair. Some are voided entirely if the owner misses a scheduled service, which is why keeping receipts for oil changes matters more than most drivers realize. Federal law in the United States prohibits a company from requiring its own branded parts or service as a condition of coverage, so an independent mechanic cannot by itself void a car's warranty. An extended warranty sold separately is not a warranty at all in the legal sense but an insurance contract, regulated differently and priced to profit the seller.",
    questions: [
      { q: "What does a warranty oblige the maker to do?", a: ["Repair or replace a product that fails as described", "Refund the purchase in full", "Pay for gas", "Provide a rental car"], correct: 0 },
      { q: "Why keep receipts for oil changes?", a: ["Missed service can void a warranty", "They lower taxes", "Dealers require them for sale", "They raise the resale price"], correct: 0 },
      { q: "Can using an independent mechanic alone void a car warranty in the U.S.?", a: ["No, federal law prohibits that requirement", "Yes, always", "Only for new cars", "Only for engines"], correct: 0 },
      { q: "What is an extended warranty in the legal sense?", a: ["An insurance contract", "A warranty", "A refund", "A discount"], correct: 0 },
      { q: "What do most warranties exclude?", a: ["Misuse, accidents and unauthorized repair", "All repairs", "Engine problems", "Nothing"], correct: 0 }
    ] }
] },

{ grade: 13, passages: [
  { title: "The Replication Problem in Psychology",
    text: "Beginning around 2011, systematic attempts to reproduce influential findings in social psychology revealed that a substantial fraction of published effects, in some collaborative projects more than half, could not be reproduced with larger samples and preregistered methods. The failures were attributed less to fraud than to a set of practices that had been considered acceptable: analyzing data in multiple ways and reporting only the version that reached significance, collecting additional participants until a result appeared, and treating a single small study as sufficient evidence. The subsequent reforms, including preregistration of hypotheses, mandatory data sharing, and journals that accept papers before results are known, have measurably improved reproducibility, although the correction has also forced textbooks and popular books to abandon findings that had circulated for decades.",
    questions: [
      { q: "What did the replication attempts reveal?", a: ["Many published effects could not be reproduced", "All findings were fraudulent", "Psychology was fully reliable", "Samples were too large"], correct: 0 },
      { q: "To what were the failures mostly attributed?", a: ["Practices once considered acceptable", "Deliberate fraud", "Bad equipment", "Political pressure"], correct: 0 },
      { q: "Which practice is named in the text?", a: ["Reporting only the analysis that reached significance", "Refusing to publish", "Using too many participants", "Sharing all data"], correct: 0 },
      { q: "What is preregistration?", a: ["Stating hypotheses before collecting data", "Registering participants' names", "Paying journals in advance", "Publishing results twice"], correct: 0 },
      { q: "What did the reforms force?", a: ["Textbooks to abandon long-circulated findings", "Journals to close", "Smaller samples", "The end of data sharing"], correct: 0 }
    ] },
  { title: "Why Central Banks Fear Expectations More Than Prices",
    text: "Contemporary monetary policy rests on the observation that inflation is sustained less by any particular shock than by the collective expectation that prices will continue to rise, since workers who anticipate higher costs demand compensating wages and firms that anticipate higher wages raise prices preemptively, each decision rational in isolation and destabilizing in aggregate. Central banks therefore devote extraordinary attention to communication, publishing forecasts and committing to explicit targets, because a credible promise to restrain inflation can accomplish part of the work before any interest rate changes. The instrument is fragile: credibility accumulated over decades can be forfeited within months if a bank appears to tolerate persistent overshoots, after which restoring it requires rate increases severe enough to impose a recession, as the early 1980s demonstrated at considerable social cost.",
    questions: [
      { q: "What sustains inflation, according to the text?", a: ["Collective expectations that prices will keep rising", "A single shock", "Low interest rates alone", "Government spending only"], correct: 0 },
      { q: "Why do central banks devote attention to communication?", a: ["A credible promise does part of the work before rate changes", "The law requires speeches", "To entertain markets", "To hide their forecasts"], correct: 0 },
      { q: "What happens when credibility is lost?", a: ["Restoring it can require a recession", "Nothing changes", "Prices fall on their own", "Banks close"], correct: 0 },
      { q: "Why are individual wage and price decisions destabilizing?", a: ["Rational alone, they reinforce each other in aggregate", "They are illegal", "They are irrational", "They lower demand"], correct: 0 },
      { q: "Which period is cited as an example?", a: ["The early 1980s", "The 1920s", "The 2008 crisis", "The 1950s"], correct: 0 }
    ] }
] },

];
