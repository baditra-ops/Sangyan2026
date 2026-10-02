/**
 * Reflection & Decision Journal Translations (English & Hindi)
 * Strictly behavioural, reflective, and non-advisory.
 */

export const translations = {
  en: {
    // Modal & Journal Header
    journalTitle: 'WHY ARE YOU MAKING THIS DECISION?',
    journalSubtitle: 'Take a moment to identify what is driving your next decision.',
    journalTag: 'DECISION JOURNAL & REFLECTION',
    close: 'Close',
    cancel: 'Cancel',

    // Section 1: Decision Drivers
    driverHeading: 'What is driving this decision?',
    driverOptions: {
      LONG_TERM_GOAL: 'Long-term goal',
      REVIEWING_EXISTING_PLAN: 'Reviewing my existing plan',
      FOLLOWING_OTHERS_ADVICE: "Following someone else's advice",
      FOMO: 'Fear of missing out',
      RECOVER_LOSS: 'Trying to recover a recent loss',
      OTHER: 'Other',
    },
    selectOne: 'Select one option',

    // Section 2: Time Horizon
    timeHorizonHeading: 'WHAT IS YOUR EXPECTED TIME HORIZON?',
    timeHorizonSubtitle: 'Consider how long you intend to hold this perspective.',
    timeHorizonOptions: {
      SHORT_TERM: 'Short-term',
      MEDIUM_TERM: 'Medium-term',
      LONG_TERM: 'Long-term',
      NOT_SURE: 'Not sure yet',
    },

    // Section 3: Reflection Prompts (Optional)
    reflectionHeading: 'OPTIONAL REFLECTION PROMPTS',
    q1Label: 'What changed since your original plan?',
    q1Placeholder: 'e.g., Emotional impulse, recent price volatility, new external news...',
    q2Label: 'What would make you reconsider this decision?',
    q2Placeholder: 'e.g., If my loss threshold is reached, or after taking a 24-hour break...',
    optionalBadge: 'Optional',

    // Actions
    submitButton: 'Record Reflection',
    reviewDecisionButton: 'Review My Decision',

    // Completion State
    completionHeading: 'REFLECTION RECORDED',
    completionMessage: 'Taking a moment to review your reasoning can help create deliberate decision-making.',
    recordedBadge: 'Cognitive Break Registered',

    // Cooling-Off Panel Prompts
    coolingOffTitle: 'TAKE A PAUSE.',
    coolingOffMessage:
      'Several behavioural signals have appeared together. Before continuing, take a moment to review your reasoning.',
    coolingOffTakeMoment: 'Take a moment to review your reasoning.',

    // Reflection History
    historyHeading: 'RECENT REFLECTIONS',
    historyBadge: 'SIMULATED REFLECTION',
    historyEmpty: 'No reflections recorded yet. Use "Review My Decision" or activate Cooling-Off to log your decision reasoning.',
    reasonLabel: 'Reason',
    timeHorizonLabel: 'Time horizon',
    reflectionLabel: 'Reflection',
    justNow: 'Just now',
  },

  hi: {
    // Modal & Journal Header
    journalTitle: 'आप यह निर्णय क्यों ले रहे हैं?',
    journalSubtitle: 'अपने अगले निर्णय के कारणों को पहचानने के लिए थोड़ा समय लें।',
    journalTag: 'निर्णय जर्नल और चिंतन',
    close: 'बंद करें',
    cancel: 'रद्द करें',

    // Section 1: Decision Drivers
    driverHeading: 'इस निर्णय के पीछे मुख्य कारण क्या है?',
    driverOptions: {
      LONG_TERM_GOAL: 'दीर्घकालिक लक्ष्य',
      REVIEWING_EXISTING_PLAN: 'मेरी मौजूदा योजना की समीक्षा',
      FOLLOWING_OTHERS_ADVICE: 'किसी अन्य की सलाह का पालन करना',
      FOMO: 'अवसर छूट जाने का डर',
      RECOVER_LOSS: 'हाल के नुकसान की भरपाई करने की कोशिश',
      OTHER: 'अन्य',
    },
    selectOne: 'एक विकल्प चुनें',

    // Section 2: Time Horizon
    timeHorizonHeading: 'आपकी अपेक्षित समय सीमा क्या है?',
    timeHorizonSubtitle: 'विचार करें कि आप इस दृष्टिकोण को कितने समय तक बनाए रखने का इरादा रखते हैं।',
    timeHorizonOptions: {
      SHORT_TERM: 'अल्पकालिक',
      MEDIUM_TERM: 'मध्यम अवधि',
      LONG_TERM: 'दीर्घकालिक',
      NOT_SURE: 'अभी निश्चित नहीं',
    },

    // Section 3: Reflection Prompts (Optional)
    reflectionHeading: 'वैकल्पिक चिंतन प्रश्न',
    q1Label: 'आपकी मूल योजना के बाद से क्या बदलाव आया है?',
    q1Placeholder: 'उदा. भावनात्मक आवेग, हालिया उतार-चढ़ाव, बाहरी समाचार...',
    q2Label: 'ऐसी क्या स्थिति होगी जिससे आप इस निर्णय पर पुनर्विचार करेंगे?',
    q2Placeholder: 'उदा. यदि नुकसान की सीमा पार होती है, या 24 घंटे का विराम लेने के बाद...',
    optionalBadge: 'वैकल्पिक',

    // Actions
    submitButton: 'चिंतन दर्ज करें',
    reviewDecisionButton: 'अपने निर्णय की समीक्षा करें',

    // Completion State
    completionHeading: 'आपका चिंतन दर्ज किया गया है',
    completionMessage: 'अपने कारणों की समीक्षा करने के लिए समय निकालने से सुविचारित निर्णय लेने में मदद मिल सकती है।',
    recordedBadge: 'संज्ञानात्मक विराम दर्ज',

    // Cooling-Off Panel Prompts
    coolingOffTitle: 'एक ठहराव लें।',
    coolingOffMessage:
      'कई व्यवहारिक संकेत एक साथ सामने आए हैं। आगे बढ़ने से पहले, अपने कारणों की समीक्षा के लिए थोड़ा समय लें।',
    coolingOffTakeMoment: 'अपने निर्णय के कारणों की समीक्षा करने के लिए थोड़ा समय लें।',

    // Reflection History
    historyHeading: 'हाल के चिंतन',
    historyBadge: 'सिम्युलेटेड चिंतन',
    historyEmpty: 'अभी तक कोई चिंतन दर्ज नहीं किया गया है। अपने कारणों को दर्ज करने के लिए "अपने निर्णय की समीक्षा करें" पर क्लिक करें।',
    reasonLabel: 'कारण',
    timeHorizonLabel: 'समय सीमा',
    reflectionLabel: 'चिंतन',
    justNow: 'अभी-अभी',
  },
};
