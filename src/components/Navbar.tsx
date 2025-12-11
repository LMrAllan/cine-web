import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-4">
      <div className="container-fluid px-4">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-film me-2"></i>
          CineWeb
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCineWeb"
          aria-controls="navbarCineWeb"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarCineWeb">
          <ul className="navbar-nav ms-4 mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/filmes">
                Filmes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/salas">
                Salas
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/sessoes">
                Sessões
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}


export default Navbar;
