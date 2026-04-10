const inputClass = (hasError?: boolean) =>
  `w-full p-3 bg-gray-50 border rounded-xl outline-none transition-all text-sm ${
    hasError
      ? 'border-red-400 focus:ring-2 focus:ring-red-200'
      : 'border-gray-200 focus:ring-2 focus:ring-brand-accent'
  }`;

const selectClass = (hasError?: boolean) =>
  `w-full p-3 bg-gray-50 border rounded-xl outline-none transition-all text-sm appearance-none pr-8 ${
    hasError
      ? 'border-red-400 focus:ring-2 focus:ring-red-200'
      : 'border-gray-200 focus:ring-2 focus:ring-brand-accent'
  }`;

export { inputClass, selectClass };
