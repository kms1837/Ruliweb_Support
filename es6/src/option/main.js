var nowMenuNumber; //현재 선택된 메뉴

$(function() {
	$(document).on('click', '#addBadUser', function() {
		var aggroUserNameTextBox = document.getElementById('aggrohuman');
		var aggroUserName = aggroUserNameTextBox.value;
		if(addUser(aggroUserName)) {
			aggroUserNameTextBox.value = '';
			$('.deleteCellBtn').click(deleteCell); //삭제 버튼 이벤트
		}
	});
	$(document).on('change', '#importOption', importOption);
	$(document).on('click', '.choiceSetting input[type="radio"]', function(data) {
		var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
		var userid = $('.select').attr('userid');
		
		aggrohuman[userid].settingType = data.target.value;
		save_json(aggrohuman);
		
		var setType = settingToStrConvert(parseInt(data.target.value));
		
		$('.select .userState').text(setType);
		logPrint('#005CFF', aggrohuman[userid].name + ' : ' + '옵션 변경');
	});

	$(document).on('change', '.choiceSetting input[type="color"]', function(data) {
		var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
		var userid = $('.select').attr('userid');

		aggrohuman[userid].settingColor = data.target.value;
		save_json(aggrohuman);

		logPrint('#005CFF', aggrohuman[userid].name + ' : ' + '옵션 변경');
	});
	
	$(document).on('keyup', '.choiceSetting #userID', function(data) {
		var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
		var userid = $('.select').attr('userid');
		var inID = data.target.value;
		data.target.value = inID.replace(/[^0-9]/, "");
		
		aggrohuman[userid].ruliwebID = data.target.value;
		
		save_json(aggrohuman);
	});
	
	$(document).on('change', '.choiceSetting #userID', function() {
		var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
		var userid = $('.select').attr('userid');
		
		$('.select .userID').text(aggrohuman[userid].ruliwebID);
		logPrint('#005CFF', aggrohuman[userid].name + ' : ' + 'ID 변경');
	});
	
	$(document).on('keyup', '.choiceSetting #userMemo', function(data) {
		var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
		var userid = $('.select').attr('userid');
		var inID = data.target.value;
		
		aggrohuman[userid].user_memo = data.target.value;
		
		save_json(aggrohuman);
	});
	
	$(document).on('change', '.choiceSetting #userMemo', function() {
		var aggrohuman = JSON.parse(localStorage['aggrohuman']).userCellInfo;
		var userid = $('.select').attr('userid');
		
		logPrint('#005CFF', aggrohuman[userid].name + ' : ' + '유저 메모 추가');
	});
	
	$(document).on('click', '.choiceBadUserOption ul.badUserList li', function(data) {
		var userid = $(data.currentTarget).attr('userid');
		userChoice(data.currentTarget, userid);
	});
});

window.onload = function() {
	var menuList = $("#left_menu li");
	nowMenuNumber = 0;
	
	for(var i=1; i<=menuList.length; i++){
		var selectorName = '#menu' + i;
		document.querySelector(selectorName).addEventListener('click',
			function(settingNumber) {
				return function(){changeMenu(settingNumber);}}(i)
			, false
		);
	}
	
	changeMenu(1);
}