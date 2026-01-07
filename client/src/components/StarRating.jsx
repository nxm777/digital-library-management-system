import { useState } from 'react';

const StarRating = ({ rating, setRating, hoverEnabled = true, readOnly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;

        return (
          <button
            type="button"
            key={ratingValue}
            className={`focus:outline-none transition-colors ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
            onClick={() => !readOnly && setRating(ratingValue)}
            onMouseEnter={() => !readOnly && hoverEnabled && setHover(ratingValue)}
            onMouseLeave={() => !readOnly && hoverEnabled && setHover(0)}
            disabled={readOnly}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-6 h-6 transition-all duration-200 ${
                ratingValue <= (hover || rating) ? 'text-yellow-400 scale-110' : 'text-gray-300'
              }`}
            >
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;