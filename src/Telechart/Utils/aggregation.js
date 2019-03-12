let aggregation = (baseClass, ...mixins) => {
    class base extends baseClass {
        constructor (...args) {
            super(...args);
            mixins.forEach((mixin) => {
                copyProps(this,(new mixin));
            });
        }
    }

    let copyProps = (target, source) => {  // this function copies all properties and symbols, filtering out some special ones
        Object.getOwnPropertyNames(source)
              .concat(Object.getOwnPropertySymbols(source))
              .forEach((prop) => {
                 if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length|\$name|\$prototype|\$\$id|extend|\$constructor)$/)){
                 	try {
                 		Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
                 	} catch (e){ $clog(e) }
                 }
                    
               })
    }

    mixins.forEach((mixin) => { // outside contructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
        copyProps(base.prototype, mixin.prototype);
        copyProps(base, mixin);
    });

    return base;
}

export default aggregation;