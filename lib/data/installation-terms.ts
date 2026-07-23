import type { PolicySection } from "@/components/PolicyDocument";

export const installationTermsMeta = "Last updated: 21 July 2026";

export const installationTermsSections: PolicySection[] = [
  {
    n: 1,
    title: "About these Terms",
    blocks: [
      {
        type: "p",
        text: "These Installation Booking and Payment Terms apply when you book and pay for a FineVu product installation through the FineVu Australia website or another booking channel operated by us.",
      },
      { type: "p", text: "The installation service is supplied by:" },
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
        ],
      },
      {
        type: "p",
        text: "In these Terms, “FineVu Australia”, “AutoXtreme”, “we”, “us” and “our” mean Motor One Group Pty Ltd.",
      },
      {
        type: "p",
        text: "“You” and “your” mean the person making the booking and, where relevant, the owner or authorised operator of the vehicle.",
      },
      { type: "p", text: "By submitting and paying for an installation booking, you agree to these Terms." },
    ],
  },
  {
    n: 2,
    title: "Who provides the installation service",
    blocks: [
      { type: "p", text: "Your installation contract is directly with Motor One Group Pty Ltd." },
      {
        type: "p",
        text: "Installation services are performed by AutoXtreme staff on behalf of Motor One Group Pty Ltd. Motor One Group Pty Ltd is responsible for:",
      },
      {
        type: "list",
        items: [
          "receiving and processing your payment;",
          "confirming and managing your appointment;",
          "performing the installation;",
          "responding to installation-related enquiries;",
          "handling complaints about the installation service; and",
          "providing any remedy required under applicable law.",
        ],
      },
      {
        type: "p",
        text: "Your card or bank statement may identify the merchant as Motor One Group, AutoXtreme, FineVu Australia or a related merchant description disclosed during checkout.",
      },
    ],
  },
  {
    n: 3,
    title: "Eligibility to book",
    blocks: [
      {
        type: "p",
        text: "You must be at least 18 years old and legally capable of entering into a contract to make a booking.",
      },
      { type: "p", text: "You confirm that you:" },
      {
        type: "list",
        items: [
          "own the vehicle or have the owner’s authority to arrange the installation;",
          "are authorised to make payment using the selected payment method;",
          "have provided accurate contact, vehicle and booking information; and",
          "have disclosed any information that may materially affect the installation.",
        ],
      },
      {
        type: "p",
        text: "We may request reasonable evidence of your identity, payment authority or authority to arrange work on the vehicle.",
      },
    ],
  },
  {
    n: 4,
    title: "Making a booking",
    blocks: [
      {
        type: "p",
        text: "The website may display available dates and times based on our current appointment schedule.",
      },
      {
        type: "p",
        text: "Submitting payment does not guarantee that an appointment has been accepted until we send you a booking confirmation.",
      },
      { type: "p", text: "Your booking confirmation will ordinarily identify:" },
      {
        type: "list",
        items: [
          "the selected installation service;",
          "any FineVu product or accessory included in the booking;",
          "the vehicle details you provided;",
          "the installation address or location;",
          "the appointment date and expected arrival or commencement window;",
          "the total amount paid;",
          "any booking-specific conditions; and",
          "our contact details.",
        ],
      },
      { type: "p", text: "You should review the confirmation promptly and tell us if any information is incorrect." },
      {
        type: "p",
        text: "If we cannot accept your requested booking, we will contact you and offer an alternative appointment or provide a refund.",
      },
    ],
  },
  {
    n: 5,
    title: "Prices and payment",
    blocks: [
      { type: "p", text: "Unless clearly stated otherwise, all prices shown to Australian consumers:" },
      {
        type: "list",
        items: [
          "are in Australian dollars;",
          "include GST;",
          "include unavoidable fees and charges known at the time of booking; and",
          "apply only to the vehicle, product and installation service described in the booking.",
        ],
      },
      { type: "p", text: "Payment is required at the time of booking unless we expressly agree otherwise." },
      {
        type: "p",
        text: "Payments may be processed through a third-party payment provider. The payment provider may collect and process your payment information under its own terms and privacy policy.",
      },
      { type: "p", text: "We will not charge an additional amount after booking unless:" },
      {
        type: "list",
        items: [
          "the additional work or item was not included in the original booking;",
          "the need for it could not reasonably have been identified from the information you supplied;",
          "we explain the additional work and price to you; and",
          "you approve the additional charge before the work is performed.",
        ],
      },
    ],
  },
  {
    n: 6,
    title: "Payment surcharges",
    blocks: [
      {
        type: "p",
        text: "Any applicable card or payment surcharge will be disclosed before you complete payment.",
      },
      {
        type: "p",
        text: "A payment surcharge will not exceed the amount we are permitted to charge under applicable law.",
      },
      {
        type: "p",
        text: "Where there is no reasonably available way to pay without a surcharge, the minimum applicable surcharge will be included in the total displayed price.",
      },
    ],
  },
  {
    n: 7,
    title: "What is included",
    blocks: [
      {
        type: "p",
        text: "Your installation includes only the products, accessories and services listed in your booking confirmation.",
      },
      { type: "p", text: "A standard installation may include, where applicable:" },
      {
        type: "list",
        items: [
          "positioning and mounting the FineVu camera;",
          "routing and concealing standard installation cabling;",
          "connecting the supplied power or hardwire cable;",
          "connecting the installation to an appropriate vehicle power source;",
          "basic configuration of the installed FineVu product;",
          "checking that the device powers on and records;",
          "basic guidance on operation; and",
          "reasonable cleaning of the immediate work area.",
        ],
      },
      { type: "p", text: "Unless expressly included in your booking, the installation price does not include:" },
      {
        type: "list",
        items: [
          "repairs to the vehicle;",
          "repairs to pre-existing electrical faults;",
          "removal of unrelated equipment;",
          "replacement of damaged trim, clips, wiring or electrical components;",
          "non-standard mounting equipment;",
          "specialist vehicle interfaces or adapters;",
          "additional batteries or battery-management systems;",
          "rectification of earlier third-party installation work;",
          "extensive fault diagnosis;",
          "removal and reinstallation at a later date; or",
          "work made necessary by inaccurate or incomplete vehicle information.",
        ],
      },
      { type: "p", text: "We will obtain your approval before performing chargeable additional work." },
    ],
  },
  {
    n: 8,
    title: "Vehicle information and compatibility",
    blocks: [
      { type: "p", text: "You must provide accurate information about the vehicle, including its:" },
      {
        type: "list",
        items: [
          "make;",
          "model;",
          "year;",
          "body type;",
          "variant, where relevant;",
          "registration number, where requested;",
          "existing cameras, alarms or accessories; and",
          "aftermarket electrical modifications.",
        ],
      },
      {
        type: "p",
        text: "Compatibility may depend on the vehicle’s electrical system, trim, safety equipment, existing accessories, windscreen configuration and other technical factors.",
      },
      {
        type: "p",
        text: "Online compatibility information is preliminary and may not identify every vehicle-specific issue.",
      },
      {
        type: "p",
        text: "We may need to inspect the vehicle before confirming that the selected installation can be completed.",
      },
      {
        type: "p",
        text: "If the selected product or installation is incompatible for reasons that we should reasonably have identified before accepting the booking, we will offer an appropriate alternative, reschedule the service or provide a refund for the affected service.",
      },
      {
        type: "p",
        text: "If incompatibility arises because material information supplied by you was inaccurate or incomplete, we may deduct reasonable costs already incurred, but only where those costs and the basis for charging them were disclosed to you.",
      },
    ],
  },
  {
    n: 9,
    title: "Preparing the vehicle",
    blocks: [
      { type: "p", text: "Before the appointment, you must:" },
      {
        type: "list",
        items: [
          "ensure that the vehicle is available at the confirmed location and time;",
          "provide the vehicle keys and any required security codes;",
          "remove valuables and personal items from the installation area;",
          "ensure reasonable access to the windscreen, dashboard, fuse box, boot and other relevant areas;",
          "disclose known electrical, battery, trim or windscreen issues;",
          "disclose existing damage near the installation area;",
          "disable or provide instructions for non-standard security devices where necessary; and",
          "ensure that the vehicle is safe for our staff to access, move or test.",
        ],
      },
      {
        type: "p",
        text: "You should back up any important recordings, settings or data stored on existing devices before the appointment.",
      },
    ],
  },
  {
    n: 10,
    title: "Installation location",
    blocks: [
      {
        type: "p",
        text: "The installation will take place at the address or premises stated in the booking confirmation.",
      },
      {
        type: "p",
        text: "Where the service is performed at your home, workplace or another nominated location, you must provide:",
      },
      {
        type: "list",
        items: [
          "lawful and safe access to the vehicle;",
          "sufficient working space around the vehicle;",
          "a reasonably level and secure work area;",
          "protection from dangerous traffic or other hazards; and",
          "reasonable shelter where weather conditions make outdoor electrical work unsafe or impractical.",
        ],
      },
      {
        type: "p",
        text: "We may suspend or reschedule an installation where the location, weather, vehicle or surrounding conditions present an unreasonable safety risk.",
      },
      {
        type: "p",
        text: "Where we reschedule for safety reasons, we will offer the next reasonably available appointment. Where the service cannot reasonably be rescheduled, we will refund the amount paid for the unperformed service.",
      },
    ],
  },
  {
    n: 11,
    title: "Accessing and moving the vehicle",
    blocks: [
      { type: "p", text: "You authorise AutoXtreme staff to:" },
      {
        type: "list",
        items: [
          "enter the vehicle;",
          "operate vehicle controls reasonably necessary for installation;",
          "access relevant trim, electrical and storage areas;",
          "disconnect and reconnect power where reasonably required;",
          "move the vehicle within or near the installation location; and",
          "perform a reasonable operational check or short test where required.",
        ],
      },
      { type: "p", text: "We will take reasonable care when accessing, moving and working on the vehicle." },
      {
        type: "p",
        text: "Some vehicle settings, clock settings, radio presets or electronic functions may reset when vehicle power is disconnected. We will take reasonable steps to avoid unnecessary disruption but cannot guarantee preservation of settings controlled by the vehicle manufacturer.",
      },
    ],
  },
  {
    n: 12,
    title: "Existing damage and vehicle condition",
    blocks: [
      {
        type: "p",
        text: "Before commencing work, we may inspect and photograph relevant parts of the vehicle to record its condition and assist with installation and quality control.",
      },
      {
        type: "p",
        text: "You authorise us to take and retain these photographs for legitimate service, warranty, training, dispute-resolution and record-keeping purposes in accordance with our Privacy Policy.",
      },
      {
        type: "p",
        text: "We are not responsible for a pre-existing defect, weakness or damage that was not caused by us, including:",
      },
      {
        type: "list",
        items: [
          "loose, brittle or previously damaged trim;",
          "damaged clips or fasteners;",
          "deteriorated wiring;",
          "existing battery or electrical faults;",
          "windscreen damage;",
          "faults in existing aftermarket accessories; or",
          "earlier installation or repair work.",
        ],
      },
      {
        type: "p",
        text: "This does not exclude our responsibility where our failure to exercise due care and skill causes or contributes to damage.",
      },
      {
        type: "p",
        text: "If we identify a material risk before commencing, we will explain it to you and may decline or modify the work where reasonably necessary.",
      },
    ],
  },
  {
    n: 13,
    title: "Installation appointment times",
    blocks: [
      {
        type: "p",
        text: "We will make reasonable efforts to attend or begin the installation within the appointment time or arrival window shown in your confirmation.",
      },
      { type: "p", text: "Appointment and completion times may be affected by:" },
      {
        type: "list",
        items: [
          "earlier installations taking longer than expected;",
          "traffic;",
          "weather;",
          "vehicle condition;",
          "product or component availability;",
          "safety issues;",
          "staff illness; or",
          "circumstances beyond our reasonable control.",
        ],
      },
      { type: "p", text: "We will notify you as soon as reasonably practicable of a significant delay." },
      {
        type: "p",
        text: "If we cannot supply the service at the agreed time or within a reasonable alternative period, you may be entitled to reschedule or cancel the affected service and receive a refund.",
      },
    ],
  },
  {
    n: 14,
    title: "Customer cancellations and rescheduling",
    subsections: [
      { title: "More than 24 hours’ notice", id: "cancel-over-24" },
      { title: "Less than 24 hours’ notice", id: "cancel-under-24" },
      { title: "No-shows", id: "cancel-no-show" },
      { title: "Consumer rights", id: "cancel-consumer-rights" },
    ],
    blocks: [
      {
        type: "p",
        text: "You may cancel or request to reschedule your booking by contacting us using the details in your confirmation.",
      },
      { type: "heading", text: "More than 24 hours’ notice", id: "cancel-over-24" },
      {
        type: "p",
        text: "Where you cancel more than 24 hours before the scheduled appointment, you may choose:",
      },
      {
        type: "list",
        items: ["a new appointment; or", "a refund of the amount paid for the cancelled service."],
      },
      { type: "heading", text: "Less than 24 hours’ notice", id: "cancel-under-24" },
      {
        type: "p",
        text: "Where you cancel or reschedule less than 24 hours before the appointment, we may deduct a late cancellation fee only if:",
      },
      {
        type: "list",
        items: [
          "the fee was clearly displayed before you completed the booking;",
          "it reasonably reflects costs or losses incurred because of the late cancellation; and",
          "it is not imposed as a penalty.",
        ],
      },
      { type: "p", text: "Any amount exceeding the applicable cancellation fee will be refunded." },
      { type: "heading", text: "No-shows", id: "cancel-no-show" },
      { type: "p", text: "A no-show occurs where:" },
      {
        type: "list",
        items: [
          "you are not present or contactable at the confirmed time;",
          "the vehicle is not available;",
          "we cannot reasonably access the vehicle or installation location; or",
          "the installation cannot proceed because you have not met a material booking requirement.",
        ],
      },
      {
        type: "p",
        text: "We may charge the no-show fee disclosed before payment, limited to our reasonable costs or losses arising from the missed appointment.",
      },
      { type: "heading", text: "Consumer rights", id: "cancel-consumer-rights" },
      {
        type: "p",
        text: "No cancellation or no-show fee applies where you are entitled to cancel because we have breached a consumer guarantee or where charging the fee would otherwise be unlawful.",
      },
      {
        type: "p",
        text: "We may waive or reduce a fee where reasonable, including in cases of genuine emergency or circumstances outside your control.",
      },
    ],
  },
  {
    n: 15,
    title: "Cancellations by us",
    blocks: [
      { type: "p", text: "We may cancel or reschedule a booking where reasonably necessary because of:" },
      {
        type: "list",
        items: [
          "staff unavailability;",
          "product or component unavailability;",
          "unsafe weather or working conditions;",
          "inaccurate booking or vehicle information;",
          "an incompatible or unsafe vehicle condition;",
          "technical failure;",
          "access restrictions; or",
          "circumstances beyond our reasonable control.",
        ],
      },
      {
        type: "p",
        text: "Where we cancel and cannot provide a suitable alternative appointment, we will refund the amount paid for the unperformed service.",
      },
      { type: "p", text: "We will not charge you a cancellation fee where we cancel the booking." },
      {
        type: "p",
        text: "Nothing in this section limits any additional remedy you may have under the Australian Consumer Law.",
      },
    ],
  },
  {
    n: 16,
    title: "Additional work",
    blocks: [
      {
        type: "p",
        text: "If our technician identifies additional work that is reasonably necessary, we will explain:",
      },
      {
        type: "list",
        items: [
          "what work is required;",
          "why it is required;",
          "the additional price;",
          "any effect on the appointment or completion time; and",
          "the consequences of declining the work.",
        ],
      },
      { type: "p", text: "We will not perform or charge for optional additional work without your approval." },
      {
        type: "p",
        text: "If you decline work that is necessary to complete the installation safely or correctly, we may stop the installation. We will discuss available alternatives and any refund or reasonable costs before proceeding.",
      },
    ],
  },
  {
    n: 17,
    title: "Customer-supplied products",
    blocks: [
      {
        type: "p",
        text: "Where you ask us to install a dash camera or accessory that you purchased elsewhere:",
      },
      {
        type: "list",
        items: [
          "you are responsible for ensuring that the correct product and components are supplied;",
          "we may inspect the product before installation;",
          "we may decline to install a product that appears damaged, unsafe, incomplete, counterfeit or incompatible;",
          "we remain responsible for performing the agreed installation service with due care and skill; and",
          "the seller or manufacturer of the product may be responsible for product defects that are unrelated to our installation work.",
        ],
      },
      {
        type: "p",
        text: "If we are asked to investigate an issue and determine that it was caused by a product defect rather than the installation, we may charge a reasonable inspection or diagnostic fee where we gave you an estimate before carrying out that work.",
      },
    ],
  },
  {
    n: 18,
    title: "Products supplied with an installation",
    blocks: [
      {
        type: "p",
        text: "Where your booking includes the supply of a FineVu product, the booking confirmation will identify:",
      },
      {
        type: "list",
        items: [
          "the product model;",
          "the included accessories;",
          "the product price;",
          "the installation price or package price; and",
          "any applicable warranty information.",
        ],
      },
      {
        type: "p",
        text: "Products supplied to consumers come with guarantees that cannot be excluded under the Australian Consumer Law.",
      },
      {
        type: "p",
        text: "Any FineVu manufacturer or distributor warranty is provided in addition to your rights under the Australian Consumer Law and does not replace those rights.",
      },
    ],
  },
  {
    n: 19,
    title: "Installation workmanship and problems",
    blocks: [
      { type: "p", text: "We will perform installation services with due care and skill." },
      {
        type: "p",
        text: "If you believe there is a problem with the installation, contact us as soon as reasonably practicable and provide:",
      },
      {
        type: "list",
        items: [
          "your booking or invoice details;",
          "your vehicle details;",
          "a description of the issue;",
          "when the issue first occurred; and",
          "photographs or video where reasonably useful.",
        ],
      },
      { type: "p", text: "We may ask for a reasonable opportunity to inspect the vehicle and installation." },
      {
        type: "p",
        text: "Where the installation does not meet an applicable consumer guarantee, you may be entitled to a remedy such as:",
      },
      {
        type: "list",
        items: [
          "rectification of the installation;",
          "re-performance of the service;",
          "cancellation and a partial or full refund; or",
          "compensation for reasonably foreseeable loss or damage.",
        ],
      },
      {
        type: "p",
        text: "The applicable remedy depends on the nature and seriousness of the problem and the requirements of the Australian Consumer Law.",
      },
      { type: "p", text: "Requesting that we inspect an issue does not remove or reduce your legal rights." },
    ],
  },
  {
    n: 20,
    title: "Dash camera performance",
    blocks: [
      {
        type: "p",
        text: "Dash camera performance and recording availability can be affected by matters including:",
      },
      {
        type: "list",
        items: [
          "interruption of vehicle or battery power;",
          "camera position;",
          "recording settings;",
          "memory-card condition or capacity;",
          "temperature;",
          "lighting and weather;",
          "physical damage;",
          "firmware or application settings;",
          "vehicle configuration; and",
          "failure to maintain or periodically check the device.",
        ],
      },
      { type: "p", text: "Installation of a dash camera does not guarantee that:" },
      {
        type: "list",
        items: [
          "every incident will be recorded;",
          "every number plate, person or event will be clearly visible;",
          "a recording will be accepted as evidence;",
          "the vehicle will be protected against theft, collision or damage; or",
          "an insurer, court, police force or other party will accept a particular recording.",
        ],
      },
      {
        type: "p",
        text: "You should periodically check that the device is powered, correctly positioned and recording as expected.",
      },
    ],
  },
  {
    n: 21,
    title: "Safe and lawful use",
    blocks: [
      { type: "p", text: "You are responsible for using the installed product safely and lawfully." },
      { type: "p", text: "You must comply with applicable:" },
      {
        type: "list",
        items: [
          "road and traffic laws;",
          "mobile-device and display restrictions;",
          "surveillance and recording laws;",
          "privacy laws;",
          "workplace policies;",
          "audio-recording requirements; and",
          "notices or consents required in the circumstances.",
        ],
      },
      {
        type: "p",
        text: "You must not adjust, operate or view the dash camera or connected mobile application while driving where doing so would be unsafe or unlawful.",
      },
    ],
  },
  {
    n: 22,
    title: "Liability",
    blocks: [
      { type: "p", text: "Nothing in these Terms excludes, restricts or modifies:" },
      {
        type: "list",
        items: [
          "the Australian Consumer Law;",
          "any consumer guarantee;",
          "any right or remedy that cannot lawfully be excluded; or",
          "our liability for conduct where exclusion would be unlawful.",
        ],
      },
      {
        type: "p",
        text: "To the maximum extent permitted by law, we are not responsible for loss or damage to the extent it is caused by:",
      },
      {
        type: "list",
        items: [
          "inaccurate or incomplete information supplied by you;",
          "a pre-existing vehicle or electrical defect;",
          "a product defect unrelated to our installation;",
          "unauthorised alteration or removal of the installation;",
          "work performed by another installer after our service;",
          "failure to follow product instructions;",
          "unlawful or unsafe product use; or",
          "failure to maintain or check the installed product.",
        ],
      },
      {
        type: "p",
        text: "We remain responsible to the extent that loss or damage is caused by our breach of contract, negligence, breach of a consumer guarantee or other unlawful conduct.",
      },
    ],
  },
  {
    n: 23,
    title: "Privacy",
    blocks: [
      { type: "p", text: "We may collect personal information including your:" },
      {
        type: "list",
        items: [
          "name;",
          "telephone number;",
          "email address;",
          "payment and transaction information;",
          "residential or installation address;",
          "vehicle make, model, year and registration;",
          "appointment details;",
          "product serial number;",
          "photographs of relevant parts of the vehicle; and",
          "service, support and warranty history.",
        ],
      },
      { type: "p", text: "We collect and use this information to:" },
      {
        type: "list",
        items: [
          "manage your booking;",
          "process payment;",
          "communicate appointment information;",
          "perform the installation;",
          "provide support;",
          "administer warranties;",
          "maintain service and financial records;",
          "investigate complaints;",
          "prevent fraud; and",
          "comply with legal obligations.",
        ],
      },
      {
        type: "p",
        text: "We may disclose relevant information to payment processors, technology providers, professional advisers and other service providers that assist us to operate the booking and installation service.",
      },
      {
        type: "p",
        text: "Personal information will be handled in accordance with our Privacy Policy and the collection notice displayed when information is collected.",
      },
    ],
  },
  {
    n: 24,
    title: "Appointment communications and marketing",
    blocks: [
      {
        type: "p",
        text: "You agree that we may send communications reasonably necessary to administer your booking, including:",
      },
      {
        type: "list",
        items: [
          "payment receipts;",
          "booking confirmations;",
          "appointment reminders;",
          "technician arrival updates;",
          "changes or delays;",
          "service follow-ups; and",
          "warranty or safety information.",
        ],
      },
      {
        type: "p",
        text: "Agreement to these Terms does not, by itself, constitute consent to receive unrelated promotional email or SMS marketing.",
      },
      {
        type: "p",
        text: "Where we request marketing consent, it will be presented separately. You may withdraw marketing consent using the unsubscribe method provided in the relevant communication.",
      },
    ],
  },
  {
    n: 25,
    title: "Refunds",
    blocks: [
      { type: "p", text: "Approved refunds will ordinarily be:" },
      {
        type: "list",
        items: [
          "paid to the original payment method;",
          "processed as soon as reasonably practicable; and",
          "for the applicable amount after any lawful and properly disclosed deduction.",
        ],
      },
      {
        type: "p",
        text: "The time taken for a refund to appear in your account may depend on your bank or payment provider.",
      },
      {
        type: "p",
        text: "We may request reasonable information to verify the booking and payment before processing a refund.",
      },
    ],
  },
  {
    n: 26,
    title: "Complaints",
    blocks: [
      { type: "p", text: "Installation or payment complaints should be directed to:" },
      {
        type: "address",
        lines: [
          "FineVu Australia / AutoXtreme",
          "Motor One Group Pty Ltd",
          "Level 9, 3 Nexus Court",
          "Mulgrave VIC 3170",
          "Australia",
          "Telephone: (03) 8809 2700",
          "Email: support@finevudashcam.com.au",
        ],
      },
      {
        type: "p",
        text: "Please include your booking reference, contact details, vehicle details and a description of the issue.",
      },
      { type: "p", text: "We will assess complaints fairly and within a reasonable time." },
      {
        type: "p",
        text: "Nothing in these Terms prevents you from contacting an applicable consumer-protection body or exercising another legal right.",
      },
    ],
  },
  {
    n: 27,
    title: "Changes to these Terms",
    blocks: [
      {
        type: "p",
        text: "The version of these Terms presented to you when you complete your booking will apply to that booking.",
      },
      {
        type: "p",
        text: "We may update these Terms for future bookings to reflect changes to our services, operations or applicable law.",
      },
      {
        type: "p",
        text: "We will not apply a later change retrospectively in a way that removes an accrued right or materially disadvantages you in relation to an existing booking.",
      },
    ],
  },
  {
    n: 28,
    title: "Severability",
    blocks: [
      {
        type: "p",
        text: "If a provision of these Terms is unlawful, invalid or unenforceable, it will be read down to the extent necessary.",
      },
      {
        type: "p",
        text: "If it cannot be read down, it will be severed without affecting the remaining provisions.",
      },
    ],
  },
  {
    n: 29,
    title: "Governing law",
    blocks: [
      { type: "p", text: "These Terms are governed by the laws of Victoria, Australia." },
      {
        type: "p",
        text: "You and Motor One Group Pty Ltd submit to the courts of Victoria and courts entitled to hear appeals from those courts.",
      },
      {
        type: "p",
        text: "Nothing in this section limits any right you may have to bring a claim in another jurisdiction under applicable consumer law.",
      },
    ],
  },
  {
    n: 30,
    title: "Entire agreement",
    blocks: [
      {
        type: "p",
        text: "These Terms, your booking confirmation, the applicable product or service description, our Privacy Policy and any expressly incorporated booking conditions form the agreement governing your installation booking.",
      },
      {
        type: "p",
        text: "If there is an inconsistency, the booking confirmation applies to the extent that it contains specific details of the service you selected, except where doing so would exclude or restrict a right that cannot lawfully be excluded.",
      },
    ],
  },
];
