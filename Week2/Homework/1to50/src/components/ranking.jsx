function Ranking({ sortedRecords, clearRecords }) {
    return (
        <section className="ranking-page">
            <div className="ranking-top">
                <h2>Ranking</h2>
                <button className="btn btn-secondary" onClick={clearRecords}>
                    초기화
                </button>
            </div>

            {sortedRecords.length === 0 ? (
                <p className="empty-ranking">아직 저장된 기록이 없습니다.</p>
            ) : (
                <div className="ranking-table-wrap">
                    <table className="table ranking-table">
                        <thead>
                            <tr>
                                <th>순위</th>
                                <th>Level</th>
                                <th>플레이 시간</th>
                                <th>날짜</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedRecords.map((record, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>Level {record.level}</td>
                                    <td>{record.timer.toFixed(2)}초</td>
                                    <td>{record.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default Ranking;