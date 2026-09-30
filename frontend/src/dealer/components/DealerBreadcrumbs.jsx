import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export default function DealerBreadcrumbs({ items = [], showBack = true }) {
  const navigate = useNavigate();

  return (
    <nav className="dealer-breadcrumbs" aria-label="Breadcrumb navigation">
      {showBack && (
        <button
          type="button"
          className="dealer-breadcrumbs-back"
          onClick={() => navigate(-1)}
          aria-label="Go back to previous screen"
          title="Go back"
        >
          <ArrowLeft size={15} />
        </button>
      )}

      <ol className="dealer-breadcrumbs-list">
        <li className="dealer-breadcrumbs-item">
          <Link to="/dealer/dashboard" className="dealer-breadcrumbs-link">
            Console
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <li className="dealer-breadcrumbs-separator" aria-hidden="true">
                <ChevronRight size={13} />
              </li>
              <li className="dealer-breadcrumbs-item">
                {isLast || !item.to ? (
                  <span className="dealer-breadcrumbs-current" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.to} className="dealer-breadcrumbs-link">
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
