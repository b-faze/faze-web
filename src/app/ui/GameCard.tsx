"use client";

type GameCardProps = {
  title: string;
  description?: string;
  stats?: string;
  img?: React.ReactElement;
  onClick?: () => void;
}
export const GameCard = ({title, description, stats, img, onClick}: GameCardProps) => {
  return (
    <div className="card mb-3" onClick={onClick} style={{cursor: onClick ? "pointer" : "default"}}>
      <div className="row g-0">
        <div className="col-md-4">
          {img}
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">
              {title}
            </h5>
            <p className="card-text">
              {description}
            </p>
            <p className="card-text">
              <small className="text-body-secondary">
                {stats}
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
