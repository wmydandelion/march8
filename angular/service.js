var m1 = angular.module('mHello', []);
m1.provider('hello', function() {
    return {
        str: "122343",
        $get: function() {
            return {
                name: this.str,
                show: function() {
                    console.log(this.name);
                    alert(this.name);
                }
            }
        }
    }
});