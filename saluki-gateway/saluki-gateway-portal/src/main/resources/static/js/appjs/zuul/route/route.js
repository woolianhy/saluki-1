var prefix = "/zuul/route";
$(function() {
	load();
});

function load() {
	$('#zuulTable')
			.bootstrapTable(
					{
						method : 'get',
						url : prefix + "/list",
						iconSize : 'outline',
						toolbar : '#exampleToolbar',
						expandColumn : '3',
						striped : true,
						dataType : "json",
						pagination : true,
						singleSelect : false,
						pageSize : 10,
						pageNumber : 1,
						sidePagination : "server",
						detailView : true,
						columns : [
								{
									checkbox : true
								},
								{
									field : 'routeId',
									title : '序号'
								},
								{
									field : 'httpRest',
									title : 'httpRest',
									formatter : function(value, row, index) {
										if (value) {
											return "是";
										} else {
											return "否"
										}
									}
								},
								{
									field : 'path',
									title : '请求路径'
								},
								{
									field : 'serviceId',
									title : '服务Id'
								},
								{
									field : 'url',
									title : '转发URL'
								},
								{
									field : 'retryable',
									title : '重试'
								},
								{
									field : 'stripPrefix',
									title : '匹配前缀'
								},
								{
									title : '操作',
									field : 'routeId',
									align : 'center',
									formatter : function(value, row, index) {
										var d = '<a class="btn btn-warning btn-sm" href="#" title="删除"  mce_href="#" onclick="remove(\''
												+ row.id
												+ '\')"><i class="fa fa-remove"></i></a> ';
										return d;
									}
								} ],
						onExpandRow : function(index, row, $detail) {
							if (!row.httpRest) {
								chirdTable(index, row, $detail);
							}
						}
					});
}
function reLoad() {
	$('#zuulTable').bootstrapTable('refresh');
}
function chirdTable(index, row, $detail) {
	var cur_table = $detail.html('<table></table>').find('table');
	var rows = [];
	rows.push(row);
	$(cur_table).bootstrapTable({
		columns : [ {
			field : 'grpc',
			title : 'grpc服务',
			formatter : function(value, row, index) {
				if (value) {
					return "是";
				} else {
					return "否"
				}
			}
		}, {
			field : 'dubbo',
			title : 'dubbo服务',
			formatter : function(value, row, index) {
				if (value) {
					return "是";
				} else {
					return "否"
				}
			}
		}, {
			field : 'serviceName',
			title : '接口名'
		}, {
			field : 'methodName',
			title : '方法名'
		}, {
			field : 'serviceGroup',
			title : '组别'
		}, {
			field : 'serviceVersion',
			title : '版本'
		} ],
		data : rows
	});
}
function add() {
	// iframe层
	layer.open({
		type : 2,
		title : '添加角色',
		maxmin : true,
		shadeClose : false, // 点击遮罩关闭层
		area : [ '800px', '520px' ],
		content : prefix + '/add' // iframe的url
	});
}
function remove(id) {
	layer.confirm('确定要删除选中的记录？', {
		btn : [ '确定', '取消' ]
	}, function() {
		$.ajax({
			url : prefix + "/remove",
			type : "post",
			data : {
				'id' : id
			},
			success : function(r) {
				if (r.code === 0) {
					layer.msg("删除成功");
					reLoad();
				} else {
					layer.msg(r.msg);
				}
			}
		});
	})

}
function edit(id) {
	layer.open({
		type : 2,
		title : '角色修改',
		maxmin : true,
		shadeClose : true, // 点击遮罩关闭层
		area : [ '800px', '520px' ],
		content : prefix + '/edit/' + id // iframe的url
	});
}
function batchRemove() {
	var rows = $('#zuulTable').bootstrapTable('getSelections'); // 返回所有选择的行，当没有选择的记录时，返回一个空数组
	if (rows.length == 0) {
		layer.msg("请选择要删除的数据");
		return;
	}
	layer.confirm("确认要删除选中的'" + rows.length + "'条数据吗?", {
		btn : [ '确定', '取消' ]
	}, function() {
		var ids = new Array();
		$.each(rows, function(i, row) {
			ids[i] = row['roleId'];
		});
		console.log(ids);
		$.ajax({
			type : 'POST',
			data : {
				"ids" : ids
			},
			url : prefix + '/batchRemove',
			success : function(r) {
				if (r.code == 0) {
					layer.msg(r.msg);
					reLoad();
				} else {
					layer.msg(r.msg);
				}
			}
		});
	}, function() {
	});
}