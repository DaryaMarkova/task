class Tree {
    constructor() {
        this.treeMap = new Map();
        this.$root = $('<ul class="tree"></ul>');
    }

    load() {
        return new Promise((resolve, reject) => {
            $.getJSON('data.json', items => {
                items.forEach(item => {
                    const key = item.parentId;

                    if (!this.treeMap.has(key)) {
                        this.treeMap.set(key, []);
                    }

                    this.treeMap.set(key, this.treeMap.get(key).concat(item))
                });
                resolve(true);
            })
        });
    }

    render(container$) {
        container$.append(this.getDOM());
        this.bindEvents();
    }

    getDOM(parentId = 0, $root = this.$root) {
        const children = this.treeMap.get(parentId) || [];

        children.forEach(child => {
            const className = child.isActive ? 'tree-item active' : 'tree-item inactive';

            const child$ = $(`
                <li class=${className}>
                    <span class='name'>${child.name}</span>
                    <span class='email'>${child.email}</span>
                    <span class='balance'>${child.balance}</span>
                    <span class='status'>${child.isActive ? 'active' : 'not active'}</span>
                </li>
            `);

            child$.append(this.getDOM(child.id, $(`<ul class='nested'></ul>`)));
            $root.append(child$);
        });

        return $root;
    }

    bindEvents() {
        $('.tree-item').click(function (event) {
            event.stopPropagation();
            $(event.currentTarget).children('.nested').toggle();
        });

        $('#btn-active').click(() => {
            this.$root.find('.tree-item').show();
            this.$root.find('[inactive]').hide();
        });

        $('#btn-inactive').click(() => {
            this.$root.find('.tree-item').show();
            this.$root.find('[active]').hide();
        });

        $('#btn-all').click(() => {
            this.$root.find('.tree-item').show();
        });
    }
}

$(document).ready(function () {
    const tree = new Tree();
    tree.load().then(() => tree.render($('body')))
});