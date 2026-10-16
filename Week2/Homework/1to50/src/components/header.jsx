function Header({ menu, setMenu, level, handleLevel, timer }) {
    return (
        <header className="header">
            <div className="header-left">
                <h1>1 to 50 숫자 클릭 게임</h1>
                <p>숫자를 순서대로 클릭!</p>

                <nav className="menu">
                    <button
                        className={menu === 'game' ? 'menu-button active' : 'menu-button'}
                        onClick={() => setMenu('game')}
                    >
                        게임
                    </button>
                    <button
                        className={menu === 'ranking' ? 'menu-button active' : 'menu-button'}
                        onClick={() => setMenu('ranking')}
                    >
                        랭킹
                    </button>
                </nav>
            </div>

            {menu === 'game' && (
                <div className="header-right">
                    <label htmlFor="level">Level</label>
                    <select
                        id="level"
                        className="form-select"
                        value={level}
                        onChange={(e) => handleLevel(Number(e.target.value))}
                    >
                        <option value={1}>Level 1</option>
                        <option value={2}>Level 2</option>
                        <option value={3}>Level 3</option>
                    </select>
                    <div className="timer">시간: {timer.toFixed(2)}초</div>
                </div>
            )}
        </header>
    );
}

export default Header;