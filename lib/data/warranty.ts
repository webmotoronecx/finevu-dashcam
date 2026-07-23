import type { PolicySection } from "@/components/PolicyDocument";

export const warrantyMeta = "Effective date: 21 July 2026";

export const warrantySections: PolicySection[] = [
  {
    n: 1,
    title: "Warranty provider",
    blocks: [
      { type: "p", text: "This voluntary warranty against defects is provided in Australia by:" },
      {
        type: "address",
        lines: [
          "Motor One Group Pty Ltd",
          "ABN 31 097 188 219",
          "Trading as AutoXtreme",
          "Operating FineVu Australia",
          "Level 9, 3 Nexus Court",
          "Mulgrave VIC 3170",
          "Australia",
          "Telephone: (03) 8809 2700",
          "Email: support@finevudashcam.com.au",
          "Website: finevudashcam.com.au",
        ],
      },
      {
        type: "p",
        text: "In this warranty, “FineVu Australia”, “Motor One Group”, “we”, “us” and “our” mean Motor One Group Pty Ltd.",
      },
    ],
  },
  {
    n: 2,
    title: "Australian Consumer Law",
    subsections: [
      { title: "Mandatory Australian Consumer Law notice", id: "acl-notice" },
      { title: "Your rights are not limited by this warranty", id: "acl-rights" },
    ],
    blocks: [
      { type: "heading", text: "Mandatory Australian Consumer Law notice", id: "acl-notice" },
      {
        type: "p",
        text: "Our goods come with guarantees that cannot be excluded under the Australian Consumer Law.",
      },
      {
        type: "p",
        text: "You are entitled to a replacement or refund for a major failure and compensation for any other reasonably foreseeable loss or damage.",
      },
      {
        type: "p",
        text: "You are also entitled to have the goods repaired or replaced if the goods fail to be of acceptable quality and the failure does not amount to a major failure.",
      },
      { type: "heading", text: "Your rights are not limited by this warranty", id: "acl-rights" },
      {
        type: "p",
        text: "This FineVu Australia Limited Warranty is provided in addition to any rights and remedies available to you under the Competition and Consumer Act 2010 (Cth), including the Australian Consumer Law, and any other applicable legislation.",
      },
      {
        type: "p",
        text: "This warranty does not exclude, restrict or modify any consumer guarantee, right or remedy that cannot lawfully be excluded, restricted or modified.",
      },
      {
        type: "p",
        text: "Australian Consumer Law rights may continue after the voluntary warranty periods stated in this document have expired. The period for which consumer guarantees apply depends on factors including the nature, price, quality, expected durability and representations made about the product.",
      },
    ],
  },
  {
    n: 3,
    title: "Products covered",
    blocks: [
      {
        type: "p",
        text: "Subject to the terms below, this voluntary warranty applies to genuine FineVu products:",
      },
      {
        type: "list",
        items: [
          "purchased new in Australia;",
          "supplied by FineVu Australia or an authorised Australian FineVu retailer;",
          "intended for sale and use in Australia; and",
          "supported by reasonable evidence of purchase.",
        ],
      },
      {
        type: "p",
        text: "Products purchased from overseas sellers, unauthorised sellers or through parallel or grey-import channels are not covered by this voluntary Australian warranty.",
      },
      {
        type: "p",
        text: "This does not remove any rights you may have against the business that sold you the product or any other rights available under applicable law.",
      },
    ],
  },
  {
    n: 4,
    title: "Warranty periods",
    blocks: [
      {
        type: "p",
        text: "The following voluntary warranty periods apply from the original retail purchase date shown on your proof of purchase:",
      },
      {
        type: "table",
        columns: ["Product", "Voluntary warranty period"],
        rows: [
          ["FineVu main dash camera unit", "3 years or 36 months"],
          ["FineVu rear camera supplied as part of a dash camera system", "3 years or 36 months"],
          ["Genuine FineVu MicroSD card", "6 months"],
          ["Genuine FineVu hardwire kit", "6 months"],
          ["Genuine FineVu power cable", "6 months"],
          ["Genuine FineVu external GPS accessory", "6 months"],
          ["Other genuine FineVu accessories", "6 months"],
        ],
      },
      {
        type: "p",
        text: "A different period may apply where a specific product, accessory, promotion or written warranty expressly states a longer period.",
      },
      {
        type: "p",
        text: "Products purchased before the effective date of this policy remain entitled to any longer written warranty period offered at the time of purchase.",
      },
      {
        type: "p",
        text: "The voluntary warranty period is not extended merely because the product is inspected. A repaired or replacement product will be covered for the remainder of the original voluntary warranty period.",
      },
      {
        type: "p",
        text: "Your Australian Consumer Law rights may apply independently and may continue beyond these periods.",
      },
    ],
  },
  {
    n: 5,
    title: "What this warranty covers",
    blocks: [
      { type: "p", text: "This warranty covers defects in materials or workmanship that:" },
      {
        type: "list",
        items: [
          "existed when the product was supplied; or",
          "arise during normal and intended use within the applicable warranty period.",
        ],
      },
      { type: "p", text: "Examples of matters that may be covered include:" },
      {
        type: "list",
        items: [
          "failure of a camera unit to power on;",
          "internal electronic component failure;",
          "failure of a camera sensor;",
          "failure of a genuine supplied cable or accessory;",
          "failure to record caused by a verified hardware defect;",
          "manufacturing defects in the product housing, connections or internal components; and",
          "another verified manufacturing or material defect.",
        ],
      },
      {
        type: "p",
        text: "Whether a particular issue is covered will depend on the cause of the problem and the results of any reasonable inspection or assessment.",
      },
    ],
  },
  {
    n: 6,
    title: "What we will do",
    blocks: [
      {
        type: "p",
        text: "If we determine that a product has a defect covered by this voluntary warranty, we will, at our option:",
      },
      {
        type: "list",
        items: [
          "repair the product;",
          "replace the product or defective component;",
          "provide an equivalent replacement where the original model is no longer reasonably available; or",
          "provide another remedy agreed with you.",
        ],
      },
      {
        type: "p",
        text: "A replacement product may be new or refurbished and will have functionality and specifications that are the same as or reasonably equivalent to the original product.",
      },
      {
        type: "p",
        text: "This discretion applies to remedies offered under this voluntary warranty. It does not limit any right you may have to choose a refund or replacement where the Australian Consumer Law gives you that choice, including where there is a major failure.",
      },
    ],
  },
  {
    n: 7,
    title: "Installation services",
    blocks: [
      {
        type: "p",
        text: "This product warranty covers FineVu hardware and accessories. It is separate from the installation service supplied by AutoXtreme.",
      },
      {
        type: "p",
        text: "Installation services supplied by AutoXtreme come with consumer guarantees under the Australian Consumer Law, including guarantees that services will be:",
      },
      {
        type: "list",
        items: [
          "provided with due care and skill;",
          "fit for any purpose made known to us where you reasonably relied on our expertise; and",
          "supplied within the agreed time or, where no time is agreed, within a reasonable time.",
        ],
      },
      {
        type: "p",
        text: "If you believe a fault was caused by an AutoXtreme installation, contact FineVu Australia using the claim procedure below.",
      },
      { type: "p", text: "Installation concerns will be assessed under:" },
      {
        type: "list",
        items: [
          "the Australian Consumer Law;",
          "the FineVu Australia Installation Booking and Payment Terms; and",
          "any separate workmanship promise expressly provided with the installation.",
        ],
      },
      {
        type: "p",
        text: "An installation performed by another qualified installer does not, by itself, void the FineVu product warranty.",
      },
      {
        type: "p",
        text: "However, this voluntary product warranty does not cover damage to the product or vehicle to the extent that the damage was caused by incorrect, unsafe or unauthorised installation.",
      },
    ],
  },
  {
    n: 8,
    title: "Matters not covered by the voluntary warranty",
    blocks: [
      {
        type: "p",
        text: "This voluntary warranty does not cover a fault, failure or damage to the extent that it was caused by:",
      },
      {
        type: "list",
        items: [
          "accident, collision, impact or external force;",
          "misuse, abuse, neglect or deliberate damage;",
          "use outside the product’s intended purpose;",
          "failure to follow the applicable product manual or safety instructions;",
          "incorrect installation or removal;",
          "incorrect wiring or connection to an unsuitable power source;",
          "excessive voltage, electrical surge or a vehicle electrical fault;",
          "use of a damaged, altered or incompatible power cable;",
          "water, liquid, fire, excessive heat or another external environmental event;",
          "unauthorised modification, disassembly or repair;",
          "use of incompatible, counterfeit or defective accessories;",
          "use of an unsuitable, defective or worn memory card;",
          "malware or unauthorised software;",
          "failure to install required firmware updates where the update would reasonably have prevented or corrected the issue;",
          "abnormal storage or operating conditions;",
          "normal wear and tear;",
          "ordinary cosmetic deterioration that does not affect operation;",
          "loss, theft or disappearance of the product;",
          "alteration, removal or illegibility of the product serial number; or",
          "an event outside our reasonable control that is unrelated to a defect in the product.",
        ],
      },
      {
        type: "p",
        text: "The presence of one of these circumstances does not automatically exclude the entire claim. An exclusion applies only to the extent that the circumstance caused or contributed to the reported problem.",
      },
      { type: "p", text: "Nothing in this section limits rights available under the Australian Consumer Law." },
    ],
  },
  {
    n: 9,
    title: "MicroSD cards and recorded data",
    blocks: [
      {
        type: "p",
        text: "MicroSD cards are storage media that can deteriorate through repeated recording, overwriting, heat and ordinary use.",
      },
      { type: "p", text: "You should:" },
      {
        type: "list",
        items: [
          "use a memory card of a type and capacity supported by the FineVu product;",
          "format the card as recommended;",
          "regularly confirm that recordings are being saved;",
          "replace a worn or unreliable card; and",
          "back up important footage as soon as practicable.",
        ],
      },
      {
        type: "p",
        text: "A failure to use a genuine FineVu memory card does not automatically void the warranty for the dash camera.",
      },
      {
        type: "p",
        text: "However, this voluntary warranty does not cover a fault to the extent that it was caused by an unsuitable, incompatible, counterfeit, damaged or worn memory card.",
      },
      {
        type: "p",
        text: "FineVu products do not guarantee that every incident will be recorded or that every recording will be retained, clear, recoverable or suitable for use as evidence.",
      },
    ],
  },
  {
    n: 10,
    title: "Recordings and data during assessment",
    blocks: [
      {
        type: "p",
        text: "You are responsible for backing up recordings and other data before returning a product for assessment.",
      },
      {
        type: "p",
        text: "Testing, repair, replacement, formatting or firmware installation may erase recordings, settings and other stored information.",
      },
      {
        type: "p",
        text: "We will take reasonable care when handling a product but cannot guarantee that recordings or data will be preserved during warranty assessment or service.",
      },
      {
        type: "p",
        text: "Nothing in this section excludes liability for loss or damage where liability cannot lawfully be excluded.",
      },
    ],
  },
  {
    n: 11,
    title: "Vehicle batteries and electrical systems",
    blocks: [
      {
        type: "p",
        text: "Parking mode and hardwired installations may draw power from the vehicle while the ignition is off.",
      },
      {
        type: "p",
        text: "Product features intended to reduce battery discharge do not guarantee that a vehicle battery will never become discharged.",
      },
      { type: "p", text: "Battery performance may be affected by:" },
      {
        type: "list",
        items: [
          "battery age and condition;",
          "vehicle usage;",
          "vehicle electrical systems;",
          "voltage settings;",
          "parking duration;",
          "environmental temperature;",
          "installation configuration; and",
          "other equipment connected to the vehicle.",
        ],
      },
      {
        type: "p",
        text: "This voluntary product warranty does not cover a vehicle battery, vehicle wiring or another vehicle component merely because a FineVu product was installed.",
      },
      {
        type: "p",
        text: "However, this does not limit our responsibility where damage was caused by a defective FineVu product, a service supplied without due care and skill, or another failure covered by applicable law.",
      },
    ],
  },
  {
    n: 12,
    title: "How to make a claim",
    blocks: [
      { type: "p", text: "You may make a warranty claim by contacting either:" },
      {
        type: "list",
        items: [
          "the authorised Australian retailer that supplied the product; or",
          "FineVu Australia directly.",
        ],
      },
      { type: "p", text: "To contact FineVu Australia:" },
      {
        type: "address",
        lines: [
          "Email: support@finevudashcam.com.au",
          "Telephone: (03) 8809 2700",
          "Postal address: Level 9, 3 Nexus Court, Mulgrave VIC 3170",
        ],
      },
      { type: "p", text: "Please provide:" },
      {
        type: "list",
        items: [
          "your name and contact details;",
          "the product model;",
          "the product serial number, where available;",
          "reasonable evidence of purchase;",
          "the purchase date;",
          "the retailer’s name;",
          "a description of the problem;",
          "when the problem began;",
          "photographs or video where reasonably useful; and",
          "details of troubleshooting already completed.",
        ],
      },
      { type: "p", text: "Do not send a product to us until we have provided return instructions." },
    ],
  },
  {
    n: 13,
    title: "Evidence of purchase",
    blocks: [
      {
        type: "p",
        text: "You must provide reasonable evidence that the product is eligible for this voluntary warranty.",
      },
      { type: "p", text: "Evidence may include:" },
      {
        type: "list",
        items: [
          "a tax invoice;",
          "a receipt;",
          "an online order confirmation;",
          "a warranty registration linked to a verified sale;",
          "a card or bank statement showing the transaction;",
          "retailer records; or",
          "another reasonable record of purchase.",
        ],
      },
      { type: "p", text: "An original paper receipt is not the only acceptable form of evidence." },
      {
        type: "p",
        text: "Warranty registration is encouraged but is not required where you can otherwise provide reasonable evidence of purchase.",
      },
    ],
  },
  {
    n: 14,
    title: "Troubleshooting and inspection",
    blocks: [
      {
        type: "p",
        text: "Before accepting a returned product, we may ask you to undertake reasonable troubleshooting, which may include:",
      },
      {
        type: "list",
        items: [
          "checking the power connection;",
          "checking product settings;",
          "updating firmware;",
          "testing with a supported memory card;",
          "formatting the memory card;",
          "resetting the product;",
          "providing photographs or diagnostic information; or",
          "testing the product in another supported configuration.",
        ],
      },
      { type: "p", text: "We may inspect and test a returned product before approving a voluntary warranty remedy." },
      {
        type: "p",
        text: "Testing may involve opening the product, checking internal components, installing firmware, resetting settings or formatting storage media.",
      },
      {
        type: "p",
        text: "We will not unreasonably delay an assessment or require troubleshooting that would be unsafe, impractical or likely to damage the product.",
      },
    ],
  },
  {
    n: 15,
    title: "Costs of making a claim",
    blocks: [
      { type: "p", text: "There is no fee to make a warranty claim." },
      { type: "p", text: "Where we authorise the return of a product, we may:" },
      {
        type: "list",
        items: [
          "provide a prepaid return label;",
          "arrange collection; or",
          "ask you to pay reasonable standard return postage initially.",
        ],
      },
      {
        type: "p",
        text: "If the claim is accepted under this voluntary warranty, we will bear or reimburse the reasonable cost of returning the covered product to us and sending the repaired or replacement product to you.",
      },
      {
        type: "p",
        text: "To request reimbursement, you must provide a receipt or other reasonable evidence of the authorised postage cost.",
      },
      {
        type: "p",
        text: "Where returning the product would involve significant cost because of its nature, size or installation, contact us before removing or returning it so that an appropriate assessment method can be arranged.",
      },
      { type: "p", text: "If assessment establishes that:" },
      {
        type: "list",
        items: [
          "the product has no fault;",
          "the issue is not covered by this voluntary warranty; or",
          "the issue was caused by an excluded circumstance,",
        ],
      },
      { type: "p", text: "we will explain the assessment outcome." },
      {
        type: "p",
        text: "We will not charge an inspection, return or freight fee without disclosing the proposed amount and obtaining your approval where approval is required.",
      },
    ],
  },
  {
    n: 16,
    title: "Removal and reinstallation costs",
    blocks: [
      {
        type: "p",
        text: "Unless we expressly agree otherwise, this voluntary product warranty does not automatically include:",
      },
      {
        type: "list",
        items: [
          "removal of the product from the vehicle;",
          "dismantling of vehicle trim;",
          "reinstallation of a repaired or replacement product;",
          "travel by an installer; or",
          "rectification of installation work performed by another provider.",
        ],
      },
      { type: "p", text: "However, these costs may be covered where:" },
      {
        type: "list",
        items: [
          "the installation service was supplied by AutoXtreme and did not meet a consumer guarantee;",
          "we expressly agreed to cover the cost;",
          "the cost is a reasonably foreseeable loss resulting from a failure to comply with the Australian Consumer Law; or",
          "applicable law otherwise requires us to bear or reimburse the cost.",
        ],
      },
      {
        type: "p",
        text: "Nothing in this section excludes a right to recover reasonable installation, removal, transport or related costs where that right is available under the Australian Consumer Law.",
      },
    ],
  },
  {
    n: 17,
    title: "Products found not to be faulty",
    blocks: [
      { type: "p", text: "If a returned product is found to be operating normally, we may:" },
      {
        type: "list",
        items: [
          "provide information about correct setup or operation;",
          "return the product to you;",
          "recommend replacement of a memory card or accessory;",
          "provide a quotation for non-warranty work; or",
          "request further information about the vehicle or installation.",
        ],
      },
      {
        type: "p",
        text: "We will not carry out chargeable work without informing you of the proposed cost and receiving your approval.",
      },
    ],
  },
  {
    n: 18,
    title: "Replacement products and discontinued models",
    blocks: [
      {
        type: "p",
        text: "Where an identical replacement is not reasonably available, we may offer a product with substantially equivalent functionality and specifications.",
      },
      { type: "p", text: "Differences may include:" },
      {
        type: "list",
        items: [
          "appearance;",
          "packaging;",
          "software interface;",
          "accessories;",
          "storage capacity; or",
          "updated product features.",
        ],
      },
      { type: "p", text: "We will not provide a materially inferior replacement under this voluntary warranty." },
      {
        type: "p",
        text: "If no reasonable repair or replacement is available, we may provide a refund or another remedy agreed with you.",
      },
      {
        type: "p",
        text: "Your rights for a major failure under the Australian Consumer Law are not limited by this section.",
      },
    ],
  },
  {
    n: 19,
    title: "Transferred or second-hand products",
    blocks: [
      { type: "p", text: "This voluntary warranty is intended for the original retail purchaser of the product." },
      {
        type: "p",
        text: "Where a product is transferred to another person during the warranty period, we may consider a claim where:",
      },
      {
        type: "list",
        items: [
          "the product was originally purchased new from FineVu Australia or an authorised Australian retailer;",
          "reasonable proof of the original purchase is provided;",
          "the product can be identified by its serial number; and",
          "the claim otherwise meets these warranty terms.",
        ],
      },
      {
        type: "p",
        text: "Any Australian Consumer Law rights held by a subsequent owner are not excluded by this section.",
      },
    ],
  },
  {
    n: 20,
    title: "Products used for business purposes",
    blocks: [
      {
        type: "p",
        text: "This voluntary warranty applies to eligible FineVu products used for personal, household, fleet or business purposes, subject to the coverage and exclusions in this document.",
      },
      {
        type: "p",
        text: "Whether the Australian Consumer Law applies to a particular business purchase depends on the nature and value of the transaction and the applicable law.",
      },
      {
        type: "p",
        text: "Nothing in this warranty excludes any non-excludable rights available to a business customer.",
      },
    ],
  },
  {
    n: 21,
    title: "Liability",
    blocks: [
      {
        type: "p",
        text: "Nothing in this warranty excludes, restricts or modifies liability that cannot lawfully be excluded, restricted or modified.",
      },
      {
        type: "p",
        text: "To the extent permitted by law, we are not responsible for loss or damage to the extent that it was caused by:",
      },
      {
        type: "list",
        items: [
          "misuse of the product;",
          "unlawful operation of the product;",
          "a pre-existing vehicle fault;",
          "an unrelated vehicle electrical problem;",
          "incorrect installation by another provider;",
          "an unauthorised modification or repair;",
          "failure to follow product instructions; or",
          "another event independent of a defect in the FineVu product or service supplied by us.",
        ],
      },
      {
        type: "p",
        text: "We remain responsible for reasonably foreseeable loss or damage caused by our failure to comply with an applicable consumer guarantee or another legal obligation.",
      },
    ],
  },
  {
    n: 22,
    title: "Repairs outside the voluntary warranty",
    blocks: [
      {
        type: "p",
        text: "If a product is not covered by this voluntary warranty or the applicable warranty period has expired, we may offer:",
      },
      {
        type: "list",
        items: [
          "a paid repair;",
          "a replacement product;",
          "an accessory replacement;",
          "technical assistance; or",
          "another available service.",
        ],
      },
      { type: "p", text: "We will provide an estimate or quotation before carrying out chargeable work." },
      {
        type: "p",
        text: "The expiry of this voluntary warranty does not mean that your Australian Consumer Law rights have expired.",
      },
    ],
  },
  {
    n: 23,
    title: "Changes to this warranty",
    blocks: [
      {
        type: "p",
        text: "The warranty terms applying to a product are the terms offered when that product was purchased.",
      },
      { type: "p", text: "We may change this warranty for products sold in the future." },
      {
        type: "p",
        text: "A later change will not retrospectively reduce a voluntary warranty already provided to a customer.",
      },
    ],
  },
  {
    n: 24,
    title: "Governing law",
    blocks: [
      {
        type: "p",
        text: "This warranty is governed by the laws of Victoria, Australia and applicable Commonwealth laws.",
      },
      {
        type: "p",
        text: "Nothing in this section limits a consumer’s right to bring a claim in another Australian jurisdiction where that right is available under law.",
      },
    ],
  },
  {
    n: 25,
    title: "Contact FineVu Australia",
    blocks: [
      {
        type: "p",
        text: "For warranty claims, technical assistance or questions about this policy, contact:",
      },
      {
        type: "address",
        lines: [
          "FineVu Australia",
          "Motor One Group Pty Ltd ABN 31 097 188 219",
          "Trading as AutoXtreme",
          "Level 9, 3 Nexus Court",
          "Mulgrave VIC 3170",
          "Australia",
          "Telephone: (03) 8809 2700",
          "Email: support@finevudashcam.com.au",
          "Website: finevudashcam.com.au",
        ],
      },
    ],
  },
];
