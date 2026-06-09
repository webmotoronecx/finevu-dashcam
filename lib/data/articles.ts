
export interface Article {
  slug: string;
  image: string;
  title: string;
  description: string;
  category: string;
  content?: string; // HTML content or just text for now
  date?: string;
  author?: string;
}

export const articles: Article[] = [
  {
    slug: "lfp-vs-nmc-australia",
    image: "https://images.unsplash.com/photo-1590502160462-236c7f8924b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXR0ZXJ5JTIwY2VsbHMlMjBjaGVtaXN0cnl8ZW58MXx8fHwxNzY0MTE5MDIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "LFP vs. NMC: Which Battery Tech is Better for Australian Drivers?",
    description: "LFP batteries are taking over, but are they right for your needs? We compare the two dominant chemistries in a comprehensive guide.",
    category: "Battery Basics",
    date: "October 30, 2024",
    author: "Dr. Elena Rossi",
    content: `
      <p class="lead">When buying an EV in 2024, you're often choosing between two battery types: Lithium Iron Phosphate (LFP) and Nickel Manganese Cobalt (NMC). The choice you make will impact your range, charging habits, and resale value.</p>
      
      <h3>The Two Contenders</h3>
      <p>Until recently, most long-range EVs used NMC batteries. They are energy-dense and perform well in cold climates. However, LFP batteries (championed by BYD and now Tesla) have surged in popularity due to their durability and lower cost.</p>

      <div class="my-10">
        <img src="https://images.unsplash.com/photo-1706166987869-5482b5ad8dd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXRoaXVtJTIwaW9uJTIwYmF0dGVyeSUyMGNlbGxzJTIwbWFjcm98ZW58MXx8fHwxNzcxOTEwOTc1fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Lithium Ion Battery Cells" class="rounded-2xl w-full object-cover h-[400px] shadow-lg" />
        <p class="text-sm text-zinc-500 mt-2 text-center">Close-up of cylindrical battery cells used in modern EV packs.</p>
      </div>

      <h3>Head-to-Head Comparison</h3>
      <div class="overflow-x-auto my-8">
        <table class="w-full border-collapse text-left text-sm">
          <thead>
            <tr class="bg-zinc-100 border-b-2 border-zinc-200">
              <th class="p-4 font-semibold text-zinc-900">Feature</th>
              <th class="p-4 font-semibold text-[var(--electric-blue)]">NMC (Nickel Manganese Cobalt)</th>
              <th class="p-4 font-semibold text-[var(--electric-green)]">LFP (Lithium Iron Phosphate)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-zinc-100">
              <td class="p-4 font-medium">Energy Density</td>
              <td class="p-4">High (More range per kg)</td>
              <td class="p-4">Moderate (Heavier for same range)</td>
            </tr>
            <tr class="border-b border-zinc-100 bg-zinc-50/50">
              <td class="p-4 font-medium">Daily Charging</td>
              <td class="p-4">Recommended to 80%</td>
              <td class="p-4">Recommended to 100%</td>
            </tr>
            <tr class="border-b border-zinc-100">
              <td class="p-4 font-medium">Lifespan (Cycles)</td>
              <td class="p-4">1,000 - 2,000 cycles</td>
              <td class="p-4">2,500 - 4,000+ cycles</td>
            </tr>
            <tr class="border-b border-zinc-100 bg-zinc-50/50">
              <td class="p-4 font-medium">Safety</td>
              <td class="p-4">Higher risk of thermal runaway</td>
              <td class="p-4">Extremely stable</td>
            </tr>
            <tr class="border-b border-zinc-100">
              <td class="p-4 font-medium">Cost</td>
              <td class="p-4">Expensive (Cobalt/Nickel)</td>
              <td class="p-4">Cheaper (Iron/Phosphate)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Why LFP is Winning in Australia</h3>
      <p>Australia's unique conditions favor LFP chemistry for several reasons:</p>
      <ul class="list-none pl-0 space-y-4">
        <li class="flex items-start">
          <span class="mr-3 mt-1 text-[var(--electric-green)]">✓</span>
          <div>
            <strong>Heat Tolerance:</strong> LFP is more chemically stable at high temperatures, making it safer and more durable during Australian summers.
          </div>
        </li>
        <li class="flex items-start">
          <span class="mr-3 mt-1 text-[var(--electric-green)]">✓</span>
          <div>
            <strong>Longevity:</strong> For drivers doing high mileage (e.g., Uber drivers or regional commuters), LFP can last over 1 million kilometers with proper care.
          </div>
        </li>
        <li class="flex items-start">
          <span class="mr-3 mt-1 text-[var(--electric-green)]">✓</span>
          <div>
            <strong>100% Usable Capacity:</strong> Since you can charge LFP to 100% daily without degradation, a "Standard Range" LFP car often has the same <em>daily usable</em> range as a "Long Range" NMC car charged to 80%.
          </div>
        </li>
      </ul>

      <h3>The Verdict</h3>
      <p>If you need maximum range for frequent interstate road trips or live in the Snowy Mountains (where NMC's cold performance shines), stick with NMC. For the vast majority of Australian drivers, however, <strong>LFP is the smarter, longer-lasting choice</strong>.</p>
    `
  },
  {
    slug: "true-cost-ownership-australia",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxjdWxhdG9yJTIwbW9uZXl8ZW58MXx8fHwxNzY0MTE5MDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "The True Cost of EV Ownership in Australia vs. ICE Vehicles",
    description: "Breaking down the numbers: fuel savings, maintenance costs, and registration incentives vs. higher upfront prices.",
    category: "Buying & Selling",
    date: "September 15, 2024",
    author: "Marcus Chen",
    content: `
      <p class="lead">EVs are more expensive to buy, but significantly cheaper to run. At what point do you break even? Let's crunch the numbers for the average Australian household.</p>
      
      <h3>The Upfront Premium</h3>
      <p>Let's compare a typical $60,000 EV (like a Tesla Model 3 or BYD Seal) against a $40,000 petrol sedan (like a Toyota Camry). The EV starts with a $20,000 disadvantage.</p>

      <div class="my-10">
        <img src="https://images.unsplash.com/photo-1640802396402-094375631000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGhvdXNlJTIwZWxlY3RyaWMlMjBjYXIlMjBjaGFyZ2luZ3xlbnwxfHx8fDE3NzE5MTA5NTV8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Solar Charging EV" class="rounded-2xl w-full object-cover h-[400px] shadow-lg" />
        <p class="text-sm text-zinc-500 mt-2 text-center">Charging from home solar is the "secret weapon" of EV ownership costs.</p>
      </div>

      <h3>Running Costs: The Fuel Gap</h3>
      <p>Assuming 15,000km driven annually, with petrol at $2.00/L and electricity at $0.25/kWh (grid mix) or $0.08/kWh (solar feed-in loss).</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full border-collapse text-left text-sm bg-white shadow-sm rounded-lg overflow-hidden">
          <thead class="bg-zinc-900 text-white">
            <tr>
              <th class="p-4">Cost Category (Annual)</th>
              <th class="p-4">Petrol Car (8L/100km)</th>
              <th class="p-4">EV (Grid Charging)</th>
              <th class="p-4">EV (Solar Charging)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-zinc-100">
              <td class="p-4 font-medium">Fuel/Energy</td>
              <td class="p-4 text-red-600 font-bold">$2,400</td>
              <td class="p-4">$600</td>
              <td class="p-4 text-[var(--electric-green)] font-bold">$180</td>
            </tr>
            <tr class="border-b border-zinc-100 bg-zinc-50">
              <td class="p-4 font-medium">Maintenance</td>
              <td class="p-4">$400</td>
              <td class="p-4">$150</td>
              <td class="p-4">$150</td>
            </tr>
            <tr class="border-b border-zinc-100">
              <td class="p-4 font-medium">Registration (NSW Example)</td>
              <td class="p-4">$400</td>
              <td class="p-4">$400</td>
              <td class="p-4">$400</td>
            </tr>
            <tr class="bg-zinc-100 font-bold">
              <td class="p-4">Total Annual Cost</td>
              <td class="p-4">$3,200</td>
              <td class="p-4">$1,150</td>
              <td class="p-4">$730</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>The "Sunshine Tax" (FBT) Exemption</h3>
      <p>For employees heavily using their car, the Federal Government's FBT exemption on EVs is a game changer. If you salary sacrifice a $60,000 EV through a novated lease, you pay for the car using <strong>pre-tax salary</strong>.</p>
      
      <div class="bg-[var(--electric-blue)]/10 border-l-4 border-[var(--electric-blue)] p-6 my-8 rounded-r-lg">
        <h4 class="text-[var(--electric-blue)] font-bold mb-2 text-lg">Did you know?</h4>
        <p class="text-zinc-800">A novated lease on an EV can save an average income earner ($90k) around <strong>$4,000 to $6,000 per year</strong> in income tax compared to buying the same car with a standard car loan.</p>
      </div>

      <h3>Verdict</h3>
      <p>Without a novated lease, the breakeven point is around 5-6 years. With a novated lease, the EV is often <strong>cheaper from day one</strong> on a weekly cash-flow basis. The era of the "expensive" EV is ending.</p>
    `
  },
  {
    slug: "understanding-range-degradation",
    image: "https://images.unsplash.com/photo-1622333847289-41e8172e650a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxFViUyMGRhc2hib2FyZCUyMGludGVyaW9yfGVufDF8fHx8MTc2NDA2ODY3MHww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Understanding EV Range Degradation",
    description: "What's normal, what's not, and when to be concerned about your electric vehicle's range performance.",
    category: "Performance",
    date: "December 15, 2023",
    author: "Tom Baker",
    content: `
      <p class="lead">Noticing your EV doesn't go as far as it used to? Some range loss is normal, but it's important to know the difference between expected degradation and a problem.</p>
      
      <h3>The "Guess-o-Meter"</h3>
      <p>Your dashboard range estimate is based on recent driving history, temperature, and battery charge. It is often inaccurate. True range degradation can only be determined by measuring the battery's energy capacity.</p>

      <div class="my-10">
        <img src="https://images.unsplash.com/photo-1622333847289-41e8172e650a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBkYXNoYm9hcmQlMjByYW5nZSUyMGRpc3BsYXl8ZW58MXx8fHwxNzcxOTEwOTU1fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="EV Dashboard Range" class="rounded-2xl w-full object-cover h-[400px] shadow-lg" />
        <p class="text-sm text-zinc-500 mt-2 text-center">Don't panic if your range drops in winter. That's physics, not degradation.</p>
      </div>
      
      <h3>Normal Degradation Curve</h3>
      <p>EV batteries typically follow a "bathtub curve" (without the second rise). They lose capacity quickly at first, then stabilize.</p>
      
      <div class="bg-zinc-900 p-8 rounded-2xl my-8 text-white">
        <h4 class="text-center mb-6 font-light">Expected Battery Capacity Over Time</h4>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <span class="w-24 text-sm text-zinc-400">New</span>
            <div class="flex-1 h-4 bg-zinc-800 rounded-full overflow-hidden">
              <div class="h-full bg-[var(--electric-green)] w-[100%]"></div>
            </div>
            <span class="w-12 text-sm font-mono">100%</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="w-24 text-sm text-zinc-400">1 Year</span>
            <div class="flex-1 h-4 bg-zinc-800 rounded-full overflow-hidden">
              <div class="h-full bg-[var(--electric-green)] w-[97%]"></div>
            </div>
            <span class="w-12 text-sm font-mono">97%</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="w-24 text-sm text-zinc-400">3 Years</span>
            <div class="flex-1 h-4 bg-zinc-800 rounded-full overflow-hidden">
              <div class="h-full bg-[var(--electric-green)] w-[94%]"></div>
            </div>
            <span class="w-12 text-sm font-mono">94%</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="w-24 text-sm text-zinc-400">5 Years</span>
            <div class="flex-1 h-4 bg-zinc-800 rounded-full overflow-hidden">
              <div class="h-full bg-[var(--electric-green)] w-[92%]"></div>
            </div>
            <span class="w-12 text-sm font-mono">92%</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="w-24 text-sm text-zinc-400">10 Years</span>
            <div class="flex-1 h-4 bg-zinc-800 rounded-full overflow-hidden">
              <div class="h-full bg-[#EAB308] w-[85%]"></div>
            </div>
            <span class="w-12 text-sm font-mono">85%</span>
          </div>
        </div>
        <p class="text-xs text-zinc-500 mt-6 text-center italic">*Based on average liquid-cooled NMC battery data. LFP degrades even slower.</p>
      </div>

      <h3>When to Be Concerned</h3>
      <p>If you notice a sudden drop in range (e.g., 10% loss in a month) or if your range drops significantly more than expected for the age of the car, it's time for a diagnostic check.</p>
    `
  },
  {
    slug: "charging-best-practices",
    image: "https://images.unsplash.com/photo-1760539127272-9eb3f0f0a48b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBlbGVjdHJpYyUyMGNhciUyMGNoYXJnaW5nfGVufDF8fHx8MTc2Mzk3OTgxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Charging Best Practices for Battery Health",
    description: "Learn the optimal charging habits to maximize your EV battery's lifespan and maintain peak performance.",
    category: "Maintenance & Care",
    date: "January 10, 2024",
    author: "Dr. Elena Rossi",
    content: `
      <p class="lead">How you charge your EV is the single biggest factor under your control for extending battery life. Treat your battery well, and it will return the favor with years of reliable service.</p>
      
      <h3>Charging Speed Hierarchy</h3>
      <p>Not all electrons are created equal. The speed at which you force energy into the battery affects its heat generation and long-term health.</p>

      <div class="grid md:grid-cols-3 gap-6 my-8">
        <div class="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
          <div class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold mb-4">L1</div>
          <h4 class="font-bold mb-2">Granny Charger</h4>
          <p class="text-sm text-zinc-500 mb-2">Standard Powerpoint</p>
          <p class="text-sm"><strong>Speed:</strong> ~2kW</p>
          <p class="text-sm"><strong>Health Impact:</strong> Best</p>
        </div>
        <div class="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
          <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-4">L2</div>
          <h4 class="font-bold mb-2">Wallbox / Public AC</h4>
          <p class="text-sm text-zinc-500 mb-2">Home or Shopping Centers</p>
          <p class="text-sm"><strong>Speed:</strong> 7-22kW</p>
          <p class="text-sm"><strong>Health Impact:</strong> Excellent</p>
        </div>
        <div class="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
          <div class="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold mb-4">L3</div>
          <h4 class="font-bold mb-2">DC Fast Charger</h4>
          <p class="text-sm text-zinc-500 mb-2">Highway Stations</p>
          <p class="text-sm"><strong>Speed:</strong> 50-350kW</p>
          <p class="text-sm"><strong>Health Impact:</strong> Moderate Use Only</p>
        </div>
      </div>

      <div class="my-10">
        <img src="https://images.unsplash.com/photo-1732194205647-11c5af7496c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBmYXN0JTIwY2hhcmdpbmclMjBzdGF0aW9uJTIwc2NyZWVufGVufDF8fHx8MTc3MTkxMDk1NXww&ixlib=rb-4.1.0&q=80&w=1080" alt="Fast Charging Screen" class="rounded-2xl w-full object-cover h-[400px] shadow-lg" />
      </div>

      <h3>The 20-80% Rule</h3>
      <p>Lithium-ion batteries are happiest when charged between 20% and 80%. Consistently discharging below 10% or holding charge above 90% causes chemical stress that accelerates degradation.</p>
      
      <h3>Temperature Matters</h3>
      <p>Avoid charging immediately after driving in extreme heat if possible. Let the battery cool down first. Similarly, in freezing temperatures, try to charge immediately after driving while the battery is still warm.</p>
    `
  },
  {
    slug: "why-need-battery-certificate",
    image: "https://images.unsplash.com/photo-1555140713-973b9f36cd1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pYyUyMGhvbGRpbmclMjBjbGlwYm9hcmQlMjBlbGVjdHJpYyUyMGNhciUyMGluc3BlY3Rpb24lMjBjZXJ0aWZpY2F0ZXxlbnwxfHx8fDE3NzE5MTE0MjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Why You Need a Certified Battery Health Report",
    description: "Think of it as a 'Building & Pest' report, but for your electric vehicle. Here is why the EV360 Certificate is your most valuable asset.",
    category: "Buying & Selling",
    date: "February 24, 2026",
    author: "Marcus Chen",
    content: `
      <p class="lead">In the world of internal combustion, we have logbooks and odometer readings. In the world of EVs, these don't tell the full story. The EV360 Battery Certificate is the new gold standard for proving your vehicle's worth.</p>
      
      <h3>What is the EV360 Certificate?</h3>
      <p>It is an independent, third-party verification of your battery's true condition. Unlike the simple "range estimate" on your dashboard, which fluctuates with weather and driving style, our certificate is based on deep diagnostic data extracted directly from the Battery Management System (BMS).</p>

      <div class="my-10">
        <img src="https://images.unsplash.com/photo-1681505526188-b05e68c77582?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250cmFjdCUyMGRvY3VtZW50JTIwc2lnbmF0dXJlJTIwaGFuZHNoYWtlfGVufDF8fHx8MTc3MTkxMTQzMHww&ixlib=rb-4.1.0&q=80&w=1080" alt="Handshake over contract" class="rounded-2xl w-full object-cover h-[400px] shadow-lg" />
        <p class="text-sm text-zinc-500 mt-2 text-center">A certified report builds trust between buyer and seller instantly.</p>
      </div>

      <h3>When Should You Get One?</h3>
      
      <div class="grid md:grid-cols-2 gap-6 my-8">
        <div class="bg-zinc-50 p-6 rounded-xl border-l-4 border-[var(--electric-blue)]">
          <h4 class="font-bold text-zinc-900 mb-2">When Selling (Crucial)</h4>
          <p class="text-sm text-zinc-600">Buyers are terrified of buying a lemon with a dying battery. A certificate removes this fear, allowing you to command a premium price and sell faster.</p>
        </div>
        <div class="bg-zinc-50 p-6 rounded-xl border-l-4 border-[var(--electric-green)]">
          <h4 class="font-bold text-zinc-900 mb-2">When Buying (Non-Negotiable)</h4>
          <p class="text-sm text-zinc-600">Never buy a used EV without seeing a recent health report. If the seller won't provide one, walk away. It's not worth the $15,000 risk.</p>
        </div>
      </div>

      <h3>For Peace of Mind (Annual Checkup)</h3>
      <p>Just like you visit the dentist once a year, an annual battery checkup is smart ownership. It helps you:</p>
      <ul class="list-disc pl-5 space-y-2">
        <li>Track your degradation curve against the average for your model.</li>
        <li>Identify potential cell imbalances early before they become critical failures.</li>
        <li>Check if you are eligible for a warranty replacement before your warranty expires.</li>
      </ul>

      <div class="bg-zinc-900 text-white p-8 rounded-2xl my-10 text-center">
        <h3 class="text-2xl font-light mb-4">Don't guess. Know.</h3>
        <p class="text-zinc-400 mb-8 max-w-2xl mx-auto">Get your certified EV360 report today and drive with confidence.</p>
        <a href="/booking" class="inline-block px-8 py-4 rounded-full bg-[var(--electric-green)] text-zinc-900 font-bold hover:bg-[#a0f075] transition-colors">
          Book Your Inspection
        </a>
      </div>
    `
  },
  {
    slug: "what-is-soh",
    image: "https://images.unsplash.com/photo-1692052664566-477579a08e8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBkcml2ZXdheSUyMGhvbWV8ZW58MXx8fHwxNzY0MDY4NjY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "What State of Health (SOH) Means",
    description: "Understanding battery SOH is crucial for knowing your EV's true condition and remaining value.",
    category: "Battery Basics",
    date: "October 12, 2023",
    author: "Dr. Elena Rossi",
    content: `
      <p class="lead">State of Health (SOH) is the single most important metric for any electric vehicle owner to understand. It represents the current maximum capacity of your battery compared to when it was new.</p>
      
      <h3>Why SOH Matters</h3>
      <p>Think of your EV battery like a fuel tank that slowly shrinks over time. When you buy a car with a 60kWh battery, it can hold 60kWh of energy. As the battery degrades, its capacity might drop to 54kWh. In this case, your SOH would be 90%.</p>
      
      <p>A lower SOH means:</p>
      <ul>
        <li>Reduced driving range</li>
        <li>Potentially slower charging speeds</li>
        <li>Lower resale value</li>
      </ul>

      <h3>How SOH is Calculated</h3>
      <p>SOH is a complex calculation that involves measuring the battery's internal resistance, voltage response, and total energy output during a discharge cycle. While your dashboard might show a "100%" charge, that 100% refers to the current available capacity, not the original design capacity.</p>

      <h3>What is a "Good" SOH?</h3>
      <p>Generally speaking:</p>
      <ul>
        <li><strong>95-100%:</strong> Excellent condition (New to 1-2 years old)</li>
        <li><strong>90-95%:</strong> Good condition (2-4 years old)</li>
        <li><strong>80-90%:</strong> Average degradation (4-7 years old)</li>
        <li><strong>Below 80%:</strong> Significant degradation</li>
        <li><strong>Below 70%:</strong> Often the threshold for warranty replacement</li>
      </ul>
    `
  },
  {
    slug: "battery-health-ev-value",
    image: "https://images.unsplash.com/photo-1691908682968-32a05445157c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBkcml2ZXdheSUyMGhvbWV8ZW58MXx8fHwxNzY0MDY4NjY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "How Battery Health Affects EV Value",
    description: "Learn why battery health is the single most important factor in determining an electric vehicle's resale value.",
    category: "Buying & Selling",
    date: "November 5, 2023",
    author: "Marcus Chen",
    content: `
      <p class="lead">In the used EV market, mileage is no longer the king of valuation. Battery health has taken the throne.</p>
      
      <h3>The New Standard for Valuation</h3>
      <p>Two identical EVs with the same mileage can have vastly different values if one has a battery SOH of 95% and the other has 82%. The difference could be thousands of dollars.</p>
      
      <h3>Why Buyers Pay More for Proven Health</h3>
      <p>Replacing an EV battery can cost anywhere from $10,000 to $25,000. Buyers are rightfully terrified of inheriting a degraded battery. A certified battery health report acts as an insurance policy against this risk, allowing sellers to command a premium.</p>
      
      <div class="bg-zinc-50 p-6 rounded-xl border-l-4 border-green-500 my-6">
        <h4 class="font-bold text-green-700 mb-2">Case Study: 2019 Nissan Leaf</h4>
        <p class="text-sm">We recently saw two 2019 Nissan Leafs sold in the same week. Car A had 45,000km and no battery report. Car B had 52,000km but came with an EV360 report showing 93% SOH. Car B sold for $2,500 more than Car A, despite the higher mileage.</p>
      </div>
    `
  },
  {
    slug: "ev-battery-myths",
    image: "https://images.unsplash.com/photo-1738101001619-f0fd42ceafb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBvZmZpY2UlMjBwYXJraW5nfGVufDF8fHx8MTc2NDA2ODY2OXww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "EV Battery Myths (Debunked)",
    description: "Separating fact from fiction when it comes to electric vehicle battery degradation and longevity.",
    category: "Battery Basics",
    date: "September 28, 2023",
    author: "Sarah Jenkins",
    content: `
      <p class="lead">There's a lot of misinformation out there about EV batteries. Let's set the record straight on the most common myths.</p>
      
      <h3>Myth 1: EV Batteries need to be replaced every 5 years</h3>
      <p><strong>Fact:</strong> Most modern EV batteries are designed to last the life of the vehicle (15-20 years). While they do degrade, total failure is rare. Most manufacturers offer 8-year warranties.</p>
      
      <h3>Myth 2: You should never charge to 100%</h3>
      <p><strong>Fact:</strong> While it's true that sitting at 100% for long periods causes stress, charging to 100% before a long trip is perfectly fine. LFP (Lithium Iron Phosphate) batteries actually prefer being charged to 100% regularly.</p>

      <h3>Myth 3: Fast charging destroys batteries</h3>
      <p><strong>Fact:</strong> Frequent fast charging can accelerate degradation slightly, but modern thermal management systems do an excellent job of protecting the battery. Occasional fast charging has negligible impact.</p>
    `
  },
  {
    slug: "pre-purchase-inspection-guide",
    image: "https://images.unsplash.com/photo-1670813007457-5e12ba8cf03f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBjaXR5fGVufDF8fHx8MTc2NDA2ODY3MXww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Pre-Purchase EV Inspection Guide",
    description: "Essential checks and questions when buying a used electric vehicle to avoid costly mistakes.",
    category: "Buying & Selling",
    date: "February 2, 2024",
    author: "Marcus Chen",
    content: `
      <p class="lead">Buying a used EV? Don't hand over your cash until you've checked these critical items.</p>
      
      <h3>1. The Battery Health Report</h3>
      <p>This is non-negotiable. If the seller can't provide a recent, independent battery health report, you must get one yourself. A car might look perfect but hide a severely degraded battery.</p>
      
      <div class="my-8 p-6 bg-red-50 border border-red-100 rounded-lg">
        <h4 class="font-bold text-red-700 mb-2">Warning Signs</h4>
        <ul class="list-disc pl-5 text-red-800 text-sm">
            <li>Seller refuses to show full charge capacity</li>
            <li>Car is always parked at 100% charge in listing photos</li>
            <li>Range estimate on dashboard is suspiciously low</li>
        </ul>
      </div>

      <h3>2. Charging Port Inspection</h3>
      <p>Check the charging pins for corrosion, damage, or signs of overheating (melting plastic). A damaged charge port can be an expensive fix.</p>
      
      <h3>3. Tire Wear</h3>
      <p>EVs are heavy and have instant torque, which can eat through tires faster than gas cars. Check for uneven wear patterns which might indicate suspension issues.</p>
      
      <h3>4. Software Updates</h3>
      <p>Check if the vehicle is running the latest software version. Some older EVs may have missed critical BMS (Battery Management System) updates that improve range and safety.</p>
    `
  },
  {
    slug: "ev-warranty-coverage",
    image: "https://images.unsplash.com/photo-1694479452720-782feb4d488b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2Mzk2OTQ1NXww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "EV Warranty Coverage Explained",
    description: "Understanding what's covered, what's not, and how to protect yourself when your warranty expires.",
    category: "Buying & Selling",
    date: "March 15, 2024",
    author: "Sarah Jenkins",
    content: `
      <p class="lead">EV warranties are different from standard car warranties. Here's what you need to know.</p>
      
      <h3>The Federal Mandate (US) & Market Standards</h3>
      <p>Most manufacturers offer an 8-year or 160,000km warranty on the battery and drive unit. This is distinct from the 3-5 year bumper-to-bumper warranty.</p>
      
      <h3>The Degradation Clause</h3>
      <p>Read the fine print! Most warranties only trigger if the battery drops below a certain SOH threshold—typically 70%. If your battery is at 71% after 7 years, you might be out of luck unless you can prove a specific cell failure.</p>
      
      <h3>Voiding Your Warranty</h3>
      <p>Be careful with modifications. Towing beyond rated capacity, ignoring recall notices, or physical damage to the battery pack can all be grounds for denying a warranty claim.</p>
    `
  },
  {
    slug: "battery-chemistry-longevity",
    image: "https://images.unsplash.com/photo-1666612509439-86c532fd2245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhciUyMGJhdHRlcnklMjBjbG9zZXVwfGVufDF8fHx8MTc2NDExODMyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Battery Chemistry and Longevity",
    description: "Deep dive into different EV battery types, their characteristics, and expected lifespan.",
    category: "Battery Basics",
    date: "April 20, 2024",
    author: "Dr. Elena Rossi",
    content: `
      <p class="lead">Not all EV batteries are created equal. The chemistry inside your battery cells dictates its performance and lifespan.</p>
      
      <h3>NMC (Nickel Manganese Cobalt)</h3>
      <p>Used in most long-range EVs (Tesla Long Range, many Hyundais/Kias). Offers high energy density (more range per kg) but is more sensitive to charging to 100%.</p>
      
      <h3>LFP (Lithium Iron Phosphate)</h3>
      <p>Used in standard range models (Tesla Model 3 RWD, BYD). Lower energy density (heavier for the same range) but extremely durable. These batteries can last 2-3x longer than NMC batteries and can be charged to 100% daily.</p>
      
      <h3>Solid State (The Future)</h3>
      <p>The "holy grail" of battery tech. Promising higher density, faster charging, and better safety. Still in development for mass market adoption.</p>
    `
  },
  {
    slug: "climate-impact-ev-batteries",
    image: "https://images.unsplash.com/photo-1665127771643-0bc02014da61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhciUyMGRyaXZpbmclMjByb2FkfGVufDF8fHx8MTc2NDA2ODk1NXww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Climate Impact on EV Batteries",
    description: "How temperature extremes affect battery performance and what you can do to minimize the impact.",
    category: "Maintenance & Care",
    date: "May 10, 2024",
    author: "Tom Baker",
    content: `
      <p class="lead">Batteries are like humans—they prefer mild temperatures, typically between 15°C and 30°C.</p>
      
      <h3>Cold Weather Performance</h3>
      <p>In freezing temps, chemical reactions slow down. You might see range drop by 20-30%. This isn't permanent damage, just temporary capacity loss. However, charging a frozen battery <em>can</em> cause permanent damage, which is why BMS systems heat the battery before accepting a fast charge.</p>
      
      <div class="my-6 p-6 bg-blue-50 border border-blue-100 rounded-lg">
        <h4 class="font-bold text-blue-800 mb-2">Winter Tip</h4>
        <p class="text-sm text-blue-700">Always use "Preconditioning" features in your EV app while the car is still plugged in at home. This warms the battery using grid power, preserving your range.</p>
      </div>

      <h3>Hot Weather Risks</h3>
      <p>Heat is the silent killer. Sustained exposure to high temperatures (above 40°C) causes permanent chemical degradation. This is why liquid-cooled batteries (like in Teslas) generally last much longer than air-cooled ones (like early Nissan Leafs) in hot climates.</p>
    `
  },
  {
    slug: "australian-ev-infrastructure",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBjaGFyZ2VyJTIwYXVzdHJhbGlhfGVufDF8fHx8MTc2NDExODk0MHww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Charging Down Under: The State of Australia's EV Infrastructure",
    description: "A deep dive into the rapid growth of Chargefox, Evie, and Tesla networks, and what it means for your daily drive.",
    category: "Maintenance & Care",
    date: "July 12, 2024",
    author: "Marcus Chen",
    content: `
      <p class="lead">Australia's charging network is growing at an exponential rate, but gaps remain. Here is the current state of play.</p>
      
      <h3>The Big Players</h3>
      <p><strong>Chargefox</strong> and <strong>Evie Networks</strong> dominate the non-Tesla space, rapidly expanding ultra-rapid (350kW) sites on major highways. Meanwhile, Tesla has opened select Superchargers to non-Tesla EVs, instantly boosting capacity for all drivers.</p>
      
      <h3>Regional vs. Urban</h3>
      <p>While capital cities are well-served, regional Australia is still playing catch-up. The NRMA's regional network has been a pioneer here, but reliability issues persist at some older sites.</p>
      
      <h3>Future Outlook</h3>
      <p>With government funding pouring into the "National EV Charging Network," the goal is to have a fast charger every 150km on major highways. By 2025, the "charging desert" map will look very different.</p>
    `
  },
  {
    slug: "resale-value-comparison",
    image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjQxMTg5NjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Resale Value: How Australia Compares to Norway and the UK",
    description: "Looking at mature EV markets gives us a crystal ball for Australian resale values. Here's what the data says.",
    category: "Buying & Selling",
    date: "August 20, 2024",
    author: "Dr. Elena Rossi",
    content: `
      <p class="lead">Australia is about 5 years behind Norway in EV adoption. This gives us a unique advantage: we can predict our future by looking at their present.</p>
      
      <h3>The "Valley of Death"</h3>
      <p>In the UK and Norway, early EVs (2011-2015) saw steep depreciation due to small batteries and lack of thermal management. However, modern EVs (2018+) are holding value much better, often outperforming equivalent petrol cars.</p>
      
      <h3>The Battery Health Factor</h3>
      <p>In mature markets, a "Battery Health Certificate" is now standard for private sales. Listings without one sit unsold for weeks. We are starting to see this trend emerge in Australia, where buyers are becoming savvy about State of Health (SOH).</p>
      
      <h3>Prediction for Australia</h3>
      <p>As the used market floods with Model 3s and BYD Attos in 2025-2026, differentiation will key. Vehicles with verified battery health histories will command significant premiums over those without.</p>
    `
  },
  {
    slug: "surviving-australian-summer",
    image: "https://images.unsplash.com/photo-1504370805625-d32c54b16100?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWFuJTIwc3VtbWVyJTIwaGVhdHxlbnwxfHx8fDE3NjQxMTg5ODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Surviving an Australian Summer: EV Battery Care in Extreme Heat",
    description: "40°C days can be brutal on batteries. Learn how to protect your EV's longevity when the mercury rises.",
    category: "Maintenance & Care",
    date: "January 4, 2025",
    author: "Tom Baker",
    content: `
      <p class="lead">Australian summers are legendary, but they can be a nightmare for lithium-ion batteries.</p>
      
      <h3>Park in the Shade</h3>
      <p>It sounds simple, but it's vital. Parking in direct sunlight on a 40°C day can raise cabin temps to 70°C and battery temps dangerously high. If you can't find shade, use a windscreen sunshade to reduce cabin heat load.</p>
      
      <h3>The "Plugged In" Advantage</h3>
      <p>Many modern EVs have active thermal management. If you leave your car plugged in (even to a standard powerpoint) on hot days, the car can use grid power to run the AC compressor and cool the battery pack without draining your range.</p>
      
      <h3>Don't Fast Charge Immediately</h3>
      <p>Driving generates heat. Fast charging generates heat. Doing both back-to-back on a scorcher is the hardest thing you can do to a battery. Give the car 15 minutes to cool down before plugging into a 350kW charger if possible.</p>
    `
  }
];
