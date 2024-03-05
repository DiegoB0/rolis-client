import React from 'react';

function ExcelSheetCard({ file, onDelete }) {
	const handleDelete = () => {
		onDelete(file._id);
	};

	return (
		<div className="card">
			<div className="card-header">{file.filename}</div>
			<div className="card-body">
				<a href={file.url} download className="btn btn-primary">
					Download
				</a>
				<button onClick={handleDelete} className="btn btn-danger">
					Delete
				</button>
			</div>
		</div>
	);
}

export default ExcelSheetCard;
