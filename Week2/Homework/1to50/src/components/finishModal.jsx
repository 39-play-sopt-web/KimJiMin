import { createPortal } from 'react-dom';

function FinishModal({ level, timer, handleConfirm }) {
    return createPortal(
        <div className="modal-background">
            <div className="finish-modal">
                <h2>Level {level} Clear! 🎉</h2>
                <p>플레이 시간: {timer.toFixed(2)}초</p>
                <button className="btn btn-primary" onClick={handleConfirm}>
                    확인
                </button>
            </div>
        </div>,
        document.body
    );
}

export default FinishModal;